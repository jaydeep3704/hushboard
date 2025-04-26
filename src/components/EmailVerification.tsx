"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useEffect, useState } from "react"
import { useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Loader from "./Loader"

const EmailVerificationSchema = z.object({
  pin: z
    .string()
    .length(6, { message: "Your one-time password must be exactly 6 digits." })
    .regex(/^\d+$/, { message: "Your one-time password must contain only numbers." }),
})

export default  function EmailVerification() {
  const { signUp, setActive, isLoaded } = useSignUp()
  const router = useRouter()
  

  
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0) // seconds remaining

  const form = useForm<z.infer<typeof EmailVerificationSchema>>({
    resolver: zodResolver(EmailVerificationSchema),
    defaultValues: {
      pin: "",
    },
  })

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const onPressVerify = async (code: string) => {
    if (!isLoaded) return;
    setIsLoading(true)
    try {
      const completeSignup = await signUp.attemptEmailAddressVerification({ code })
      console.log(completeSignup)
      if (completeSignup.status !== "complete") {
        console.log(JSON.stringify(completeSignup, null, 2))
      }

      if (completeSignup.status === "complete") {
        await setActive({ session: completeSignup.createdSessionId })
        router.push('/boards')
      }
    } catch (error: any) {
      console.log(JSON.stringify(error, null, 2))
      form.setError("pin", {
        type: "manual",
        message: error.errors[0].message,
      });
    }
    setIsLoading(false)
  }

  const onResendCode = async () => {
    if (!isLoaded || resendTimer > 0) return;

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      console.log("Verification code resent!");
      setResendTimer(60); // Start 1 minute cooldown
    } catch (error: any) {
      console.error("Error resending code:", error);
    }
  }

  function onSubmit(data: z.infer<typeof EmailVerificationSchema>) {
    onPressVerify(data.pin)
  }

  return (
    <section className="bg-secondary-foreground opacity-50 p-10 rounded-xl border border-white/15 z-100">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex justify-center flex-col items-center">
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center">
                <FormLabel className="text-lg">Verify Email</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup className="flex justify-between">
                      <InputOTPSlot index={0} className="size-10" />
                      <InputOTPSlot index={1} className="size-10" />
                      <InputOTPSlot index={2} className="size-10" />
                      <InputOTPSlot index={3} className="size-10" />
                      <InputOTPSlot index={4} className="size-10" />
                      <InputOTPSlot index={5} className="size-10" />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Please enter the one-time password sent to your phone.
                </FormDescription>
                <FormMessage />

                <div className="text-sm text-white/50 mt-2">
                  {resendTimer > 0 ? (
                    <p>
                      Resend code in <span className="font-semibold">{String(Math.floor(resendTimer / 60)).padStart(2, '0')}:{String(resendTimer % 60).padStart(2, '0')}</span>
                    </p>
                  ) : (
                    <p>
                      Didn't receive an email?{" "}
                      <span onClick={onResendCode} className="text-white cursor-pointer hover:underline">
                        Resend Code
                      </span>
                    </p>
                  )}
                </div>

              </FormItem>
            )}
          />

          <button type="submit" className="hover:opacity-70 transition py-2 px-10 bg-accent rounded-md mt-6 text-primary cursor-pointer text-lg inline-flex items-center justify-center ">
            {isLoading?<Loader/>:'Verify Email'}
          </button>
        </form>
      </Form>
    </section>
  )
}
