import { Cookies } from "@/lib/auth/session";
import { OAuthProvider } from "@prisma/client";
import { z } from "zod";
import crypto from "node:crypto"

const STATE_COOKIE_KEY = "oAuthState"
const CODE_VERIFIER_COOKIE_KEY = "oAuthCodeVerifier"
// Ten minutes in seconds
const COOKIE_EXPIRATION_SECONDS = 60 * 10


export class OAuthClient<T> {

    private get redirectUrl() {
        return new URL("github", process.env.OAUTH_REDIRECT_BASE)
    }
    private readonly tokenSchema = z.object({
        access_token: z.string(),
        token_type: z.string(),
    })

    private readonly userSchema = z.object({
        id: z.number(),
        name: z.string().nullable(),
        login: z.string(),
        avatar_url: z.string(),
        email: z.string().nullable()
    })

    createAuthURL(cookies: Pick<Cookies, "set">) {
        const state=createState(cookies)
        const url = new URL("https://github.com/login/oauth/authorize")
        url.searchParams.set("client_id", process.env.GITHUB_CLIENT_ID)
        url.searchParams.set("redirect_uri", this.redirectUrl.toString())
        url.searchParams.set("allow_signup", "true")
        url.searchParams.set("response_type", "code")
        url.searchParams.set("scope", "read:user user:email")
        url.searchParams.set("state",state)
        return url.toString()
    }



    async fetchUser(code: string, provider: OAuthProvider,state:string,cookies:Pick<Cookies,"get">) {

        const isValidState=await validateState(state,cookies)
        if(!isValidState){
            throw new InvalidStateError()
        }
        const { accessToken, tokenType } = await this.fetchToken(code)
        switch (provider) {
            case "github": {
                const user = await fetch("https://api.github.com/user", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `${tokenType} ${accessToken}`
                    },
                }).then((res) => res.json()).then((rawUser) => {
                    const { data: user, error, success } = this.userSchema.safeParse(rawUser)
                    if (!success) throw new InvalidUserError(error)
                    return {
                        id: user.id,
                        name: user.name,
                        login: user.login,
                        avatar: user.avatar_url,
                        email: user.email
                    }
                })

                if(!user.email){
                    const emails= await fetch("https://api.github.com/user/emails", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `${tokenType} ${accessToken}`
                    },
                    }).then((res)=>res.json())
                    const filteredEmail=emails.filter((email)=>email.primary==true)
                    const primaryEmail=filteredEmail[0].email
                    user.email=primaryEmail
                }
                
                return user
            }
            default:
                return null
        }

    }

    private async fetchToken(code: string) {
        return await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json"
            },
            body: new URLSearchParams({
                code,
                redirect_uri: this.redirectUrl.toString(),
                grant_type: "authorization_code",
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET
            })
        }).then((res) => res.json()).then((rawData) => {
            const { data, success, error } = this.tokenSchema.safeParse(rawData)
            if (!success) throw new InvalidTokenError(error)
            return {
                accessToken: data.access_token,
                tokenType: data.token_type
            }
        })
    }
}

function createState(cookies: Pick<Cookies, "set">) {
  const state = crypto.randomBytes(64).toString("hex").normalize()
  cookies.set(STATE_COOKIE_KEY, state, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    expires: Date.now() + COOKIE_EXPIRATION_SECONDS * 1000,
  })
  return state
}

function createCodeVerifier(cookies: Pick<Cookies, "set">) {
  const codeVerifier = crypto.randomBytes(64).toString("hex").normalize()
  cookies.set(CODE_VERIFIER_COOKIE_KEY, codeVerifier, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    expires: Date.now() + COOKIE_EXPIRATION_SECONDS * 1000,
  })
  return codeVerifier
}

function validateState(state: string, cookies: Pick<Cookies, "get">) {
  const cookieState = cookies.get(STATE_COOKIE_KEY)?.value
  return cookieState === state
}

function getCodeVerifier(cookies: Pick<Cookies, "get">) {
  const codeVerifier = cookies.get(CODE_VERIFIER_COOKIE_KEY)?.value
  if (codeVerifier == null) throw new InvalidCodeVerifierError()
  return codeVerifier
}



export class InvalidTokenError extends Error {
    constructor(zodError: z.ZodError) {
        super("Invalid Token")
        this.cause = zodError
    }
}
export class InvalidUserError extends Error {
    constructor(zodError: z.ZodError) {
        super("Invalid Token")
        this.cause = zodError
    }
}

class InvalidStateError extends Error {
  constructor() {
    super("Invalid State")
  }
}

class InvalidCodeVerifierError extends Error {
  constructor() {
    super("Invalid Code Verifier")
  }
}
