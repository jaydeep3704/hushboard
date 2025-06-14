"use client"
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { twMerge } from 'tailwind-merge'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { IconBrandGoogle } from '@tabler/icons-react'
import { useSignIn, useSignUp } from '@clerk/nextjs'
import { Form, FormMessage, FormItem, FormControl, FormField } from '@/components/ui/form'
import { useForm, SubmitHandler } from 'react-hook-form'
import { SignupSchema } from '@/zodSchema/authSchema'
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation'
import EmailVerification from '@/components/EmailVerification'
import Loader from '@/components/Loader'

const page = () => {

  const { isLoaded, setActive, signUp } = useSignUp()
  const { signIn } = useSignIn()
  const [error, setError] = useState("")
  const [code, setCode] = useState("")
  const [pendingVerification, setPendingVerification] = useState<Boolean>(false)
  const [isloading, setIsLoading] = useState(false)
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    resolver: zodResolver(SignupSchema)
  })

  const onSubmit = async (data: { email: string, username: string, password: string, confirmPassword: string }) => {
    const { email, username, password, confirmPassword } = data;
    setIsLoading(true)
    if (!isLoaded) {
      setIsLoading(false)
      return;
    }
    try {
      await signUp.create({
        emailAddress: email,
        password: password,
        username: username
      })
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code"
      })

      setPendingVerification(true)
    } catch (error: any) {
      console.log(JSON.stringify(error, null, 2))
      const clerkErrors = error.errors;

      clerkErrors.forEach((err: any) => {
        if (err.meta?.paramName === 'email_address') {
          form.setError('email', { message: err.message });
        }
        else if (err.meta?.paramName === 'username') {
          form.setError('username', { message: err.message });
        }
        else {
          // general fallback
          setError(err.message);
        }
      });

    }
    setIsLoading(false)
  }
  const [isGoogleSignInLoading, setIsGoogleSignInLoading] = useState(false)


  const handleGoogleAuth = async (e: any) => {

    e.preventDefault()
    setIsGoogleSignInLoading(true)
    try {
      await signIn?.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: 'https://hushboard.vercel.app/sso-callback',      
        redirectUrlComplete: 'https://hushboard.vercel.app/boards',
      });

    } catch (err) {
      console.error('Google Auth Error:', err);
    }
    setIsGoogleSignInLoading(false)
  };






  const fields = [
    {
      label: 'Username',
      placeholder: 'johnDoe123',
      type: 'text',
      id: 'username',
    },
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
    {
      label: 'Confirm Password',
      placeholder: 'johnDoe@123',
      type: 'password',
      id: 'confirmPassword'

    },

  ]


  return (
    <section className='w-full min-h-screen h-full flex justify-center items-center z-1'>
      {!pendingVerification ? (<Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='z-100 bg-secondary-foreground/60 p-8 rounded-lg border border-white/15 m-4'>
          <div className='text-center'>
            <h1 className='text-3xl'>Welcome to HushBoard</h1>
            <p className='text-md mt-3 text-white/50'>Create your account</p>
          </div>

          <div className='mt-5 flex flex-col gap-5'>
            {
              fields.map((item) => {
                return (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name={item.id as "username" || "email" || "password" || "confirm_password"}
                    render={({ field }) => (
                      <FormItem>

                        <FormControl>
                          <LabelInputContainer>
                            <Label htmlFor={item.id}>{item.label}</Label>
                            <div className='relative'>
                              <Input className='' type={(item.label === "Password" || item.label === "Confirm Password") ? (showPassword ? "text" : "password") : item.type} placeholder={item.placeholder} id={item.id} {...field} />
                              {(item.label === "Password" || item.label === "Confirm Password") && (
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


            <button className='py-2 bg-accent w-full text-center text-primary rounded-md flex items-center justify-center gap-5' type='submit'>

              {
                isloading ? <Loader /> : (<span className='flex gap-5 items-center'>Sign Up  <ArrowRight className='size-4' />
                </span>)
              }
            </button>
            <div id="clerk-captcha"></div>

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

          <p className='text-sm mt-5 text-center text-white/50'>Already have an account ? <Link href='signin' className='text-white'>
            Log in Here</Link></p>
        </form>
      </Form>) :
        <EmailVerification />
      }
      <BackgroundBeams className='z-2' />
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