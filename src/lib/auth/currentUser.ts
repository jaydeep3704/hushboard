"use server"
import {cache} from "react"
import { getUserFromSession } from "./session"
import { cookies } from "next/headers"

export const getCurrentUser=cache(async()=>{
     const user=await getUserFromSession(await cookies())
     return user
})