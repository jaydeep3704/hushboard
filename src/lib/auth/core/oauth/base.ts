import { Cookies } from "@/lib/auth/session";
import { z } from "zod";

export class OAuthClient<T> {

    private get redirectUrl() {
        return new URL("github", process.env.OAUTH_REDIRECT_BASE)
    }
    private readonly tokenSchema = z.object({
        access_token: z.string(),
        token_type: z.string(),
    })

    createAuthURL(cookies: Pick<Cookies, "set">) {
        const url = new URL("https://github.com/login/oauth/authorize")
        url.searchParams.set("client_id", process.env.GITHUB_CLIENT_ID)
        url.searchParams.set("redirect_uri", this.redirectUrl.toString())
        url.searchParams.set("allow_signup", "true")
        url.searchParams.set("prompt", "select_account")
        url.searchParams.set("response_type", "code")
        return url.toString()
    }

 

    async fetchUser(code: string) {
        const {accessToken,tokenType}=await this.fetchToken(code)
    }

    private fetchToken(code:string){
        return fetch("https://github.com/login/oauth/access_token", {
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
            console.log(rawData)
            const { data, success, error } = this.tokenSchema.safeParse(rawData)
            if(!success) throw new InvalidTokenError(error)
            return{
                accessToken:data.access_token,
                tokenType:data.token_type
            }
        })
    }
}


export class InvalidTokenError extends Error{
    constructor(zodError:z.ZodError){
        super("Invalid Token")
        this.cause=zodError
    }
}