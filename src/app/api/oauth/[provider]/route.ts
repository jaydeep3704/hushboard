import { z } from "zod"
import { NextRequest } from "next/server"
import { redirect } from "next/navigation"
import { getOAuthClient } from "@/lib/auth/core/oauth/base"
import { OAuthProvider } from "@prisma/client"
import prisma from "@/lib/prisma"
import { createSession } from "@/lib/auth/session"
import { cookies } from "next/headers"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider: rawProvider } = await params
  const code = request.nextUrl.searchParams.get("code")
  const state = request.nextUrl.searchParams.get("state")
  const provider = z.enum(["github", "google"]).parse(rawProvider)

  if (typeof code !== "string" || typeof state !== "string") {
    redirect(
      `/sign-in?oauthError=${encodeURIComponent("Failed To Connect. Please Try Again")}`
    )
  }

  try {
    const oAuthClient = getOAuthClient(provider)
    const oAuthUser = await oAuthClient.fetchUser(code, state, await cookies())
    const user = await connectUserToAccount(oAuthUser, provider)
    await createSession(user, await cookies())
  } catch (error) {
    console.error(error)
    redirect(
      `/sign-in?oauthError=${encodeURIComponent("Failed to connect. Please try again.")}`
    )
  }

  redirect("/")
}

// ✅ Normalized User type from OAuth
type OAuthUser = {
  id: string
  email: string
  avatar: string
  username: string
}

async function connectUserToAccount(
  { id, email, avatar, username }: OAuthUser,
  provider: OAuthProvider
) {
  return await prisma.$transaction(async (tx) => {
    let user = await tx.user.findUnique({
      where: { email },
      select: { id: true, email: true, avatar: true }
    })

    if (!user) {
      // First time login – create user
      user = await tx.user.create({
        data: {
          email,
          username,
          avatar,
          isVerified: true
        },
        select: { id: true, email: true, avatar: true }
      })
    } else if (avatar) {
      // Existing user – update avatar
      user = await tx.user.update({
        where: { id: user.id },
        data: { avatar },
        select: { id: true, email: true, avatar: true }
      })
    }

    // Always create OAuth account (skip duplicate)
    await tx.oAuthAccount.createMany({
      data: [{
        provider,
        providerAccountId: id,
        userId: user.id,
        avatar,
        username
      }],
      skipDuplicates: true
    })

    return user
  })
}
