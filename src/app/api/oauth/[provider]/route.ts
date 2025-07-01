import { z} from "zod"
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { OAuthClient } from "@/lib/auth/core/oauth/base";
export async function GET(request:NextRequest,{params}:{params:Promise<{provider:string}>}){
    const {provider:rawProvider}=await params
    const code=request.nextUrl.searchParams.get("code")
    const provider=z.enum(["github","google"]).parse(rawProvider)
    
    if(typeof code!=="string"){
        redirect(
            `
            /sign-in?oauthError=${encodeURIComponent(
                "Failed To Connect Please Try again"
            )}
            `
        )
    }

    const user=await new OAuthClient().fetchUser(code)
    console.log(user)
}