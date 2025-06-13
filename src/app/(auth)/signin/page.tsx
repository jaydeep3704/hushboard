"use client"
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { twMerge } from 'tailwind-merge'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { IconBrandGoogle } from '@tabler/icons-react'
import { Form, FormMessage, FormItem, FormControl, FormField } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { SigninSchema } from '@/zodSchema/authSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

import Loader from '@/components/Loader'
const page = () => {


  const { signIn, isLoaded, setActive } = useSignIn()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isGoogleSignInLoading, setIsGoogleSignInLoading] = useState(false)


  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter()
  const form = useForm({
    defaultValues: {
      email: '',
      password: ''
    },

    resolver: zodResolver(SigninSchema)
  })

  const onSubmit = async (data: { email: string, password: string }) => {
    setLoading(true)
    if (!isLoaded) {
      return;
    }
    try {
      const result = await signIn.create({
        identifier: data.email,
        password: data.password
      })

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/boards"); // redirect after login
      } else {
        console.log(result);
      }
    }
    catch (error: any) {
      setError(error.errors[0]?.message || "Something went wrong");
      const clerkErrors = error.errors || [];

      clerkErrors.forEach((error: any) => {
        switch (error.code) {
          case "form_identifier_not_found":
            form.setError("email", { message: "No account found with this email." });
            break;
          case "form_password_incorrect":
            form.setError("password", { message: "Incorrect password." });
            break;
          default:
            form.setError("email", { message: error.message || "Something went wrong." });
            break;
        }
      });
    }
    setLoading(false)
  }

  const handleGoogleAuth = async (e: any) => {

    e.preventDefault()
    setIsGoogleSignInLoading(true)
    try {
      await signIn?.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: 'https://hushboard.vercel.app/sso-callback',      // ✅ full URL
        redirectUrlComplete: 'https://hushboard.vercel.app/boards',

      });

    } catch (err) {
      console.error('Google Auth Error:', err);
    }
    setIsGoogleSignInLoading(false)
  };





  const fields = [
    {
      label: 'Email',
      placeholder: 'johndoe123@gmail.com',
      type: 'email',
      id: 'email'
    },
    {
      label: 'Password',
      placeholder: 'johnDoe@123',
      type: 'password',
      id: 'password'

    },
  ]


  return (
    <section className='w-full min-h-screen h-full flex justify-center items-center z-1'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='z-100 bg-secondary-foreground/60 p-8 rounded-lg border border-white/15 m-4'>
          <div className='text-center'>
            <h1 className='text-3xl'>Welcome to HushBoard</h1>
            <p className='text-md mt-3 text-white/50'>Login to continue</p>
          </div>

          <div className='mt-5 flex flex-col gap-5'>
            {
              fields.map((item) => {
                return (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name={item.id as "email" || "password"}
                    render={({ field }) => (
                      <FormItem>

                        <FormControl>
                          <LabelInputContainer>
                            <Label htmlFor={item.id}>{item.label}</Label>
                            <div className='relative'>
                              <Input className='' type={item.label === "Password" ? showPassword ? "text" : "password" : item.label} placeholder={item.placeholder} id={item.id} {...field} />
                              {item.label === "Password" && (
                                <button className='absolute right-3 top-3 cursor-pointer transition' type='button' onClick={() => setShowPassword(!showPassword)}>
                                  {showPassword ? <EyeOff className='text-white/70 size-5' /> : <Eye className='text-white/70 size-5' />}
                                </button>
                              )}
                            </div>
                          </LabelInputContainer>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              })
            }


            <button className='hover:opacity-70 transition ease-in-out py-2 bg-accent w-full text-center text-primary rounded-md flex items-center justify-center gap-5' type='submit'>
              {
                loading ? <Loader /> : <span className='flex items-center justify-center gap-5'>Sign In  <ArrowRight className='size-4' /></span>
              }
            </button>
          </div>

          <div className='flex w-full items-center mt-5 gap-5 text-white/50'>
            <span className='block w-full h-[1px] bg-white/15'></span>
            OR
            <span className='block w-full h-[1px] bg-white/15'></span>
          </div>

          <div className='mt-5'>
            <button className='flex gap-5 items-center justify-center bg-accent/80 backdrop-blur-sm w-full py-2 rounded-md text-primary hover:opacity-70 transition ease-in-out' onClick={handleGoogleAuth}>
              {!isGoogleSignInLoading ?
                <span className='flex items-center gap-5'><IconBrandGoogle /> Sign in with Google</span> :
                <Loader />
              }
            </button>
          </div>

          <p className='text-sm mt-5 text-center text-white/50'>Don't have an account ? <Link href='signup' className='text-white'>
            Register Here </Link></p>
        </form>
        <BackgroundBeams className='z-2' />
      </Form>
    </section>
  )
}

export default page


const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={twMerge("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
}