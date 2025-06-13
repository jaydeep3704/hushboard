"use client"
import React from 'react'
import Image from 'next/image'
import Illustration from "@/assets/anonymous-illustration.png"
import IllustrationDark from "@/assets/anonymous-dark.png"
import { motion } from 'motion/react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { buttonVariants } from './ui/button'
const Hero = () => {

    const heroTitle = "Say What Matters - anonymously"
    const {theme}=useTheme();

    return (
        <section className='min-h-[80vh] flex items-center '>
            <div className=' mx-auto  flex md:flex-row flex-col-reverse  w-full  md:w-5xl  md:justify-between items-center gap-20  '>
                <div className='w-full md:w-1/2  flex flex-col items-center md:items-start'>
                    <div className='flex flex-col gap-6  '>
                        <h1 className='capitalize md:text-6xl text-4xl text-center md:text-start'>{heroTitle.split(" ").map((word, index) =>
                            <motion.span key={index} initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                                transition={{
                                    duration: 0.3,
                                    delay: index * 0.1,
                                    ease: "easeInOut",
                                }}>{word + " "}</motion.span>
                        )}</h1>
                        <motion.p
                            initial={{ opacity: 0, filter: "blur(4px)" }}
                            animate={{ opacity: 1, filter: "blur(0px)" }}
                            transition={{ delay: 0.5, ease: "easeInOut", duration: 0.3 }}
                            className='text-muted-foreground text-sm md:text-md md:text-start text-center'>
                            Get honest feedback without revealing who you are.
                            <br />Share your link and receive anonymous messages instantly
                        </motion.p>
                    </div>

                    <motion.div className='flex gap-5 mt-10'
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        transition={{
                            duration: 0.3,
                            delay: 1,
                        }}
                    >
                        <Link href="/boards" className={buttonVariants({ variant: "default" })}>Generate Your Link</Link>

                        <a href="#how-it-works" className={buttonVariants({ variant: "outline" })}>
                            See How It Works
                        </a>


                    </motion.div>

                </div>
                <div className='md:w-1/3  w-2/3 flex justify-center'>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, ease: 'easeIn' }} className='animate-bounce-1 relative '>
                        
                            
 
                                <Image src={Illustration} alt="illustration" width={400}/> 

                            

                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Hero
