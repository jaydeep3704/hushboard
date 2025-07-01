"use server"
import {cache} from "react"
import { getUserFromSession } from "./session"
import { cookies } from "next/headers"
import prisma from "../prisma"
import { redirect } from "next/navigation"

type FullUser = Exclude<
  Awaited<ReturnType<typeof getUserFromDb>>,
  undefined | null
>

type User = Exclude<
  Awaited<ReturnType<typeof getUserFromSession>>,
  undefined | null
>



function _getCurrentUser(options:{
     withFullUser:true
     redirectIfNotFound:true
}):Promise<FullUser>

function _getCurrentUser(options:{
     withFullUser:true
     redirectIfNotFound?:false
}):Promise<FullUser | null>

function _getCurrentUser(options:{
     withFullUser?:false
     redirectIfNotFound:true
}):Promise<User>

function _getCurrentUser(options?:{
     withFullUser?:false
     redirectIfNotFound?:false
}):Promise<User | null>

async function _getCurrentUser({
  withFullUser = false,
  redirectIfNotFound = false,
} = {}) {
  const user = await getUserFromSession(await cookies())

  if (user == null) {
    if (redirectIfNotFound) return redirect("/sign-in")
    return null
  }

  if (withFullUser) {
    const fullUser = await getUserFromDb(user.id)
    // This should never happen
    if (fullUser == null) throw new Error("User not found in database")
    return fullUser
  }

  return user
}



export const getCurrentUser=cache(_getCurrentUser)


export const getUserFromDb=async (userId:string)=>{
     const userData=await prisma.user.findUnique({
          where:{
               id:userId
          },
          select:{
               email:true,
               username:true,
               id:true

          }
     })
     return userData
}

