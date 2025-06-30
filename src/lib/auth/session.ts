
import crypto from "crypto"
import { redis } from "../redis"
import { z } from "zod"

const sessionSchema=z.object({
    id:z.string(),
    email:z.string()
})

type Cookies={
    set:(
        key:string,
        value:string,
        options:{
            secure?:boolean,
            httpOnly?:boolean,
            sameSite?:"strict"|"lax",
            expires?:number
        }
    )=>void
    get:(key:string)=>{name:string,value:string} | undefined
    delete:(key:string)=>void
}

const SESSION_EXPIRATION_SECONDS=7*24*60*60
const COOKIE_SESSION_KEY="session-id"

export async function createSession(user:z.infer<typeof sessionSchema>,cookies:Cookies){
    const sessionId=crypto.randomBytes(512).toString("hex").normalize()
    await redis.set(`session:${sessionId}`,sessionSchema.parse(user),{
        ex:SESSION_EXPIRATION_SECONDS
    })
    setCookie(sessionId,cookies)
}
async function  getUserSessionById(sessionId:string){
    const rawUser=await redis.get(`session:${sessionId}`)
    const {data:user,success}=sessionSchema.safeParse(rawUser)
    return success ? user: null
}


export async function removeUserFromSession(cookies:Pick<Cookies,"get" | "delete">){
        
    const sessionId=cookies.get(COOKIE_SESSION_KEY)?.value
    if(sessionId==null) return null

    await redis.del(`session:${sessionId}`)
    cookies.delete(COOKIE_SESSION_KEY)
}


export  function getUserFromSession(cookies:Pick<Cookies,"get">){
    const sessionId=cookies.get(COOKIE_SESSION_KEY)?.value
    if(sessionId==null) return null
    return getUserSessionById(sessionId)
}

function setCookie(sessionId:string,cookies:Pick<Cookies,"set">){
    cookies.set(COOKIE_SESSION_KEY,sessionId,{
        secure:true,
        httpOnly:true,
        sameSite:"lax",
        expires:Date.now()+SESSION_EXPIRATION_SECONDS*1000
    })
}