import { Cookies } from "@/lib/auth/session";
import { OAuthProvider } from "@prisma/client";
import { z } from "zod";
import crypto from "node:crypto";
import { createGithubOAuthClient } from "./github";
import { createGoogleOAuthClient } from "./google";

const STATE_COOKIE_KEY = "oAuthState";
const CODE_VERIFIER_COOKIE_KEY = "oAuthCodeVerifier";
const COOKIE_EXPIRATION_SECONDS = 60 * 10;

export class OAuthClient<T> {
    private readonly provider: OAuthProvider;
    private readonly clientId: string;
    private readonly clientSecret: string;
    private readonly scopes: string[];
    private readonly urls: {
        auth: string;
        token: string;
        user: string;
    };
    private readonly userInfo: {
        schema: z.ZodSchema<T>;
        parser: (
            data: T,
            accessToken: string
        ) => Promise<{
            id: string;
            email: string;
            avatar: string;
            username: string;
        }>;
    };

    private readonly tokenSchema = z.object({
        access_token: z.string(),
        token_type: z.string(),
    });

    constructor({
        provider,
        clientId,
        clientSecret,
        urls,
        scopes,
        userInfo,
    }: {
        provider: OAuthProvider;
        clientId: string;
        clientSecret: string;
        scopes: string[];
        urls: {
            auth: string;
            token: string;
            user: string;
        };
        userInfo: {
            schema: z.ZodSchema<T>;
            parser: (
                data: T,
                accessToken: string
            ) => Promise<{
                id: string;
                email: string;
                avatar: string;
                username: string;
            }>;
        };
    }) {
        this.provider = provider;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.urls = urls;
        this.scopes = scopes;
        this.userInfo = userInfo;
    }

    private get redirectUrl() {
        return new URL(this.provider, process.env.OAUTH_REDIRECT_BASE);
    }

    createAuthURL(cookies: Pick<Cookies, "set">) {
        const state = createState(cookies);
        const codeVerifier = createCodeVerifier(cookies);

        const codeChallenge = crypto
            .createHash("sha256")
            .update(codeVerifier)
            .digest("base64url");

        const url = new URL(this.urls.auth);
        url.searchParams.set("client_id", this.clientId);
        url.searchParams.set("redirect_uri", this.redirectUrl.toString());
        if (this.provider === "github") {
            url.searchParams.set("allow_signup", "true");
        }
        url.searchParams.set("response_type", "code");
        url.searchParams.set("scope", this.scopes.join(" "));
        url.searchParams.set("state", state);
        url.searchParams.set("code_challenge_method", "S256");
        url.searchParams.set("code_challenge", codeChallenge);
        return url.toString();
    }

    async fetchUser(
        code: string,
        state: string,
        cookies: Pick<Cookies, "get">
    ) {
        const isValidState = validateState(state, cookies);
        if (!isValidState) throw new InvalidStateError();

        const codeVerifier = getCodeVerifier(cookies);
        const { accessToken, tokenType } = await this.fetchToken(code, codeVerifier);

        const rawUser = await fetch(this.urls.user, {
            method: "GET",
            headers: {
                "Authorization": `${tokenType} ${accessToken}`,
            },
        }).then((res) => res.json());

        const result = this.userInfo.schema.safeParse(rawUser);
        if (!result.success) throw new InvalidUserError(result.error);

        return await this.userInfo.parser(result.data, accessToken);
    }

    private async fetchToken(code: string, codeVerifier: string) {
        const response = await fetch(this.urls.token, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
            },
            body: new URLSearchParams({
                code,
                redirect_uri: this.redirectUrl.toString(),
                grant_type: "authorization_code",
                client_id: this.clientId,
                client_secret: this.clientSecret,
                code_verifier: codeVerifier,
            }),
        });

        const rawData = await response.json();
        const result = this.tokenSchema.safeParse(rawData);
        if (!result.success) throw new InvalidTokenError(result.error);

        return {
            accessToken: result.data.access_token,
            tokenType: result.data.token_type,
        };
    }
}

function createState(cookies: Pick<Cookies, "set">) {
    const state = crypto.randomBytes(64).toString("hex");
    cookies.set(STATE_COOKIE_KEY, state, {
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        expires: Date.now() + COOKIE_EXPIRATION_SECONDS * 1000,
    });
    return state;
}

function createCodeVerifier(cookies: Pick<Cookies, "set">) {
    const codeVerifier = crypto.randomBytes(64).toString("hex");
    cookies.set(CODE_VERIFIER_COOKIE_KEY, codeVerifier, {
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        expires: Date.now() + COOKIE_EXPIRATION_SECONDS * 1000,
    });
    return codeVerifier;
}

function validateState(state: string, cookies: Pick<Cookies, "get">) {
    const cookieState = cookies.get(STATE_COOKIE_KEY)?.value;
    return cookieState === state;
}

function getCodeVerifier(cookies: Pick<Cookies, "get">) {
    const codeVerifier = cookies.get(CODE_VERIFIER_COOKIE_KEY)?.value;
    if (!codeVerifier) throw new InvalidCodeVerifierError();
    return codeVerifier;
}

// Error Classes
export class InvalidTokenError extends Error {
    constructor(zodError: z.ZodError) {
        super("Invalid Token");
        this.cause = zodError;
    }
}
export class InvalidUserError extends Error {
    constructor(zodError: z.ZodError) {
        super("Invalid User");
        this.cause = zodError;
    }
}
class InvalidStateError extends Error {
    constructor() {
        super("Invalid State");
    }
}
class InvalidCodeVerifierError extends Error {
    constructor() {
        super("Invalid Code Verifier");
    }
}

export function getOAuthClient(provider: OAuthProvider) {
    switch (provider) {
        case "github":
            return createGithubOAuthClient()
        case "google":
            return createGoogleOAuthClient()
        default:
            throw new Error(`Invalid provider`)
    }
}