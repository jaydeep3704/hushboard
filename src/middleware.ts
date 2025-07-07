
import {type NextRequest, NextResponse } from "next/server";
import { getUserFromSession } from "./lib/auth/session";
import { cookies } from "next/headers";

const privateRoutes=["/boards"]
const authRoutes=["/sign-in","/sign-up"]
export async function middleware(request:NextRequest){
  const response=await middlewareAuth(request) ?? NextResponse.next()
  return response;
}

async function middlewareAuth(request:NextRequest){
  
  const user=await getUserFromSession(await cookies())
  if(privateRoutes.includes(request.nextUrl.pathname)){
    if(user==null) {
      return NextResponse.redirect(new URL('/sign-in',request.url))
    }
  }

  if(authRoutes.includes(request.nextUrl.pathname)){
    if(user){
      return NextResponse.redirect(new URL('/',request.url))
    }  
  }
}


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};