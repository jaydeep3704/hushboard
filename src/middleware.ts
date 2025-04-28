import { clerkMiddleware ,createRouteMatcher} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


const isProtectedRoute = createRouteMatcher(['boards/(.*)', '/messages(.*)']);
const isAuthPage = createRouteMatcher(["/signin(.*)", "/signup(.*)"]);


export default clerkMiddleware(async (auth, req) => {

  

  // If user is signed in and tries to access /signin or /signup, redirect
  if ((await auth()).userId && isAuthPage(req)) {
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }


  if (isProtectedRoute(req)) await auth.protect()

},{signInUrl:"signin",signUpUrl:"signup"})


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};