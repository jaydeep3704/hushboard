import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { twMerge } from 'tailwind-merge'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { IconBrandGoogle } from '@tabler/icons-react'
const page = () => {
  return (
    <section className='w-full min-h-screen h-full flex justify-center items-center z-1'>
      <form action="" className='z-100 bg-secondary-foreground/60 p-8 rounded-lg border border-white/15 m-4'>
        <div className='text-center'>
        <h1 className='text-3xl'>Welcome to HushBoard</h1>      
        <p className='text-md mt-3 text-white/50'>Create your account</p>  
        </div>

        <div className='mt-5 flex flex-col gap-5'>
           
           
            <LabelInputContainer>
                <Label htmlFor='username'>Username</Label>
                <Input className='' type='text' placeholder='janedoe1234' id='username' />
            </LabelInputContainer>
            <LabelInputContainer>
                <Label htmlFor='email'>Email</Label>
                <Input className='' type='email' placeholder='janedoe@gmail.com' id='email' />
            </LabelInputContainer>
            
            <LabelInputContainer>
                <Label htmlFor='password'>Password</Label>
                <Input className='' type='password' placeholder='Janedoe@123' id='password'/>
            </LabelInputContainer>

              
            <LabelInputContainer>
                <Label htmlFor='confirm-password'>Confirm Password</Label>
                <Input className='' type='password' placeholder='Janedoe@123' id='confirm-password'/>
            </LabelInputContainer>
  

            <button className='py-2 bg-accent w-full text-center text-primary rounded-md flex items-center justify-center gap-5'>Sign Up  <ArrowRight className='size-4'/></button>
        </div>
           
           <div className='flex w-full items-center mt-5 gap-5 text-white/50'>
              <span className='block w-full h-[1px] bg-white/15'></span>
              OR
              <span className='block w-full h-[1px] bg-white/15'></span>
           </div>

           <div className='mt-5'>
               <button className='flex gap-5 items-center justify-center bg-accent/80 backdrop-blur-sm w-full py-2 rounded-md text-primary '><IconBrandGoogle/> Sign in with Google</button>
           </div>

            <p className='text-sm mt-5 text-center text-white/50'>Already have an account ? <Link href='signin' className='text-white'> 
            Log in Here</Link></p>
      </form>
      <BackgroundBeams className='z-2'/>
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