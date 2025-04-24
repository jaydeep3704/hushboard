"use client"
import React from 'react'
import Image from 'next/image'
import Illustration from "@/assets/anonymous-illustration.png"
import { motion } from 'motion/react'

import Link from 'next/link'
const Hero = () => {

    const heroTitle = "Say What Matters - anonymously"


    return (
        <section className='py-28 px-[4%] '>
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
                            className='text-white/50 text-sm md:text-md md:text-start text-center'>
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
                        <button className='py-2 px-8 rounded-md bg-accent text-primary font-semibold text-sm md:text-md'>Generate Your Link</button>
                        <a href="#how-it-works" className="py-2 px-8 rounded-md bg-secondary-foreground font-semibold border border-white/15 text-sm md:text-md cursor-pointer inline-block">
                            See How It Works
                        </a>


                    </motion.div>

                </div>
                <div className='md:w-1/3  w-2/3 flex justify-center'>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, ease: 'easeIn' }} className='animate-bounce-1 relative '>
                        <Image src={Illustration} alt='anonymous-illustration' className='object-cover' />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Hero
