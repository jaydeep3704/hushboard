"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { SigninSchema, SignupSchema } from "@/zodSchema/authSchema"
import prisma from "../prisma"
import { comparePasswords, generateSalt, hashPassword } from "./core/passwordHasher"
import { redis } from "@/lib/redis"
import { generateOTP } from "./generateOTP"
import { Resend } from "resend"
import { OTPTemplate } from "@/components/emailTemplates/OTPTemplate"
import { createSession, removeUserFromSession } from "./session"
import { cookies } from "next/headers"
import { OAuthProvider } from "@prisma/client"
import { getOAuthClient, OAuthClient } from "./core/oauth/base"
import { BoardSchema } from "../schema"
import { getCurrentUser } from "./currentUser"
const resend = new Resend(process.env.RESEND_API_KEY)

export async function SignIn(unsafeData: z.infer<typeof SigninSchema>) {
  try {
    const { success, data } = SigninSchema.safeParse(unsafeData)
    if (!success) return { success: false, error: "Failed to Sign In User" }

    const user = await prisma.user.findUnique({
      where: {
        email: data.email
      }
    })

    if (!user) return { success: false, error: "User with this email doesn't exist. Please try again with different email" }

    const isCorrectPassword = await comparePasswords({
      hashedPassword: user.password,
      password: data.password,
      salt: user.salt
    })
    if (!isCorrectPassword) return { success: false, error: "Password is incorrect" }

    await createSession(user, await cookies())

    return { success: true, redirectTo: `/` }

  }
  catch (error) {
    if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
      throw Error("An unexpected error occured")
    }
  }
}


export async function SignUp(unsafeData: z.infer<typeof SignupSchema>) {
  try {
    // 1. Validate input
    const parsed = SignupSchema.safeParse(unsafeData)
    if (!parsed.success) {
      return { success: false, error: "Invalid signup data" }
    }

    const data = parsed.data

    // 2. Check existing user by username
    const userByUsername = await prisma.user.findUnique({ where: { username: data.username } })
    if (userByUsername?.isVerified) {
      return { success: false, error: "user with this username already exists" }
    } else if (userByUsername) {
      await prisma.user.delete({ where: { id: userByUsername.id } })
    }

    // 3. Check existing user by email
    const userByEmail = await prisma.user.findUnique({ where: { email: data.email } })
    if (userByEmail?.isVerified) {
      return { success: false, error: "user with this email already exists" }
    } else if (userByEmail) {
      await prisma.user.delete({ where: { id: userByEmail.id } })
    }

    // 4. Create new user
    const salt = generateSalt()
    const hashedPassword = await hashPassword(data.password, salt)

    const user = await prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword as string,
        email: data.email,
        salt: salt,
      }
    })

    // 5. Send OTP
    const OTP = generateOTP()
    const emailResult = await sendVerificationEmail(user.id, OTP)

    if (!emailResult.success) {
      return { success: false, error: emailResult.error }
    }

    // 6. Success, return redirect path
    return { success: true, redirectTo: `/verify-otp/${user.id}` }

  } catch (err) {
    console.error("Unexpected signup error:", err)
    return { success: false, error: "Something went wrong. Please try again." }
  }
}


export async function sendVerificationEmail(userId: string, OTP: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isVerified: true, email: true }
    })

    if (!user) return { success: false, error: "User doesn't exist" }
    if (user.isVerified) return { success: false, error: "User already verified" }

    await redis.del(`${userId}-OTP`) // cleanup any existing

    const { error: emailError } = await resend.emails.send({
      from: 'Hushboard <onboarding@resend.dev>',
      to: user.email,
      subject: 'Verify your Email',
      react: OTPTemplate({ OTP }),
    })

    if (emailError) {
      return { success: false, error: "Failed to send verification email" }
    }

    await redis.set(`${userId}-OTP`, OTP, { ex: 600 }) // 10 mins
    return { success: true }

  } catch (err) {
    console.error("Error in sendVerificationEmail:", err)
    return { success: false, error: "Internal error while sending email" }
  }
}


export async function verifyCode(userId: string, OTP: string): Promise<{ success: boolean; error?: string; redirectTo?: string }> {
  try {
    // 1. Fetch user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return { success: false, error: "User doesn't exist" }
    }

    if (user.isVerified) {
      return { success: false, error: "User is already verified" }
    }

    // 2. Get OTP from Redis
    const storedOTP = await redis.get(`${userId}-OTP`)
    if (!storedOTP) {
      return { success: false, error: "Verification code expired. Please request a new one." }
    }

    // 3. Check OTP match
    if (storedOTP.toString() !== OTP) {
      return { success: false, error: "Incorrect verification code" }
    }

    // 4. Update user and delete OTP
    await prisma.user.update({
      where: { id: userId, isVerified: false },
      data: { isVerified: true }
    })

    await redis.del(`${userId}-OTP`)
    await createSession(user, await cookies())
  }
  catch (err) {
    console.error("Unexpected error in verifyCode:", err)
    return { success: false, error: "Something went wrong. Please try again later." }
  }
  redirect("/")
}


export async function Logout() {
  await removeUserFromSession(await cookies())
  redirect("/sign-in")
}
export async function oAuthSignIn(provider: OAuthProvider) {
  const client = getOAuthClient(provider)
  const url = client.createAuthURL(await cookies())
  redirect(url)
}



export async function createBoard(unsafeData: z.infer<typeof BoardSchema>) {
  try {
    const parsed = BoardSchema.safeParse(unsafeData);
    if (!parsed.success) {
      return { success: false, error: "Failed to Create Board", issues: parsed.error.errors };
    }

    const data = parsed.data;
    const user = await getCurrentUser({
      redirectIfNotFound: true,
    });

    const board=await prisma.board.create({
      data:{
        name:data.title,
        description:data.description,
        category:data.category,
        mode:data.mode,
        userId:user.id,
        expiresAt:data.duration!=="" ? new Date(Date.now()+Number(data.duration)*60*60*1000):null
      }
    })
    if(board) return { success: true, board };
  } catch (error) {
    console.error("Error creating board:", error);
    return { success: false, error: "Unexpected error while creating board" };
  }
}
