

"use client"
import { GeneralSubmitButton } from "@/components/general/SubmitButton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useState } from "react";
import {z} from "zod"
import { toast } from "sonner";
import { verifyCode } from "@/lib/auth/actions";
import { ValidationError } from "@/lib/utils/Error";
import { sendVerificationEmail } from "@/lib/auth/actions";
import { generateOTP } from "@/lib/auth/generateOTP";
const otpSchema=z.string({message:"OTP is required"}).min(6).max(6)

async function  verifyUser(otp:string,userId:string) {
    try {
        otpSchema.parse(otp)
        const result=await verifyCode(userId,otp)
        if(result?.error && !result?.success) return toast.error(result.error)
        else toast.success("Email Verified !")
                
    } catch (error) {
        if(error instanceof z.ZodError){
            return toast.error("Invalid OTP . Minimum 6 characters are needed")
        }
        else if(error instanceof Error && error.message!=="NEXT_REDIRECT"){
            return toast.error(error.message)
        }
        else{
            console.log(error.message)
        }
    }
}


async function resendEmail(userId:string){
    try {
        const OTP=generateOTP()
        const result=await sendVerificationEmail(userId,OTP)
        if(result?.error && !result?.success) return toast.error(result.error)

    } catch (error) {
        if(error instanceof ValidationError && error.message!=="NExT_REDIRECT"){
            return toast.error(error.message)
        }
        else{
            return toast.error("Something went wrong")
        }
    }
}

export  function VerifyOTP({userId}:{userId:string}) {

    const[value,setValue]=useState("")
    return (
            <div>
            <Card className="lg:min-w-sm min-w-[350px]  mx-auto">
                <CardHeader>
                    <CardTitle className="text-center">Verify Your Email</CardTitle>
                    <CardDescription className="text-center ">Enter the 6 digit verification code sent to your email</CardDescription>
                </CardHeader>
                <CardContent className="w-full flex justify-center flex-col items-center">
                    <InputOTP
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                        value={value}
                        onChange={(otp)=>setValue(otp)}
                        >
                        <InputOTPGroup>
                            <InputOTPSlot index={0}  className="size-10"/>
                            <InputOTPSlot index={1}  className="size-10"/>
                            <InputOTPSlot index={2}  className="size-10"/>
                            <InputOTPSlot index={3}  className="size-10"/>
                            <InputOTPSlot index={4}  className="size-10"/>
                            <InputOTPSlot index={5}  className="size-10"/>
                        </InputOTPGroup>
                    </InputOTP>
                </CardContent>
                <CardFooter>
                    <form onSubmit={(e)=>{
                        e.preventDefault()
                        verifyUser(value,userId)
                    }} className="w-full">
                     <GeneralSubmitButton text="Verify OTP"  variant="outline" classname="w-full" disabled={(value.length<6)}/>
                    </form>
                </CardFooter>
                 <p className="text-muted-foreground text-sm text-center text-balance">Didn't recieve an OTP? 
                 {" "}<button className="text-blue-600 font-semibold cursor-pointer" onClick={()=>resendEmail(userId)}>Click to resend</button>
                </p>
            </Card>
          </div>
    )
}