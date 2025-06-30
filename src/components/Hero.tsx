"use client"
import React from 'react'
import Image from 'next/image'
import Illustration from "@/assets/anonymous-illustration.png"
import IllustrationDark from "@/assets/IllustrationDark.png"
import { motion } from 'motion/react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { buttonVariants } from './ui/button'
import { Clock, Lock, Share2 } from 'lucide-react'

const Hero = () => {
  const heroTitle = "Say What Matters - anonymously"
  const { theme } = useTheme()

  return (
    <section className="relative py-20 overflow-hidden h-screen">
      {/* Light mode blob */}
      <div className="absolute top-[-100px] left-[-80px] w-[300px] h-[300px] bg-pink-400 rounded-full blur-3xl opacity-30 animate-pulse dark:hidden z-0"></div>

      {/* Dark mode blob */}
      <div className="absolute bottom-[-80px] right-[-100px] w-[300px] h-[300px] bg-white rounded-full blur-2xl opacity-10 hidden dark:block z-0"></div>

      <div className="relative z-10 mx-auto flex md:flex-row flex-col-reverse w-full max-w-7xl justify-between items-center gap-20 px-6">
        {/* Text */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
          <div className="flex flex-col gap-6">
            <h1 className="capitalize md:text-6xl text-4xl text-center md:text-start leading-tight font-semibold">
              {heroTitle.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: "easeInOut",
                  }}
                >
                  {word + " "}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.5, ease: "easeInOut", duration: 0.3 }}
              className="text-muted-foreground text-sm md:text-md md:text-start text-center"
            >
              Get honest feedback without revealing who you are.
              <br />
              Share your link and receive anonymous messages instantly.
            </motion.p>
          </div>

          {/* Buttons */}
          <motion.div
            className="flex gap-5 mt-5 md:mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 1 }}
          >
            <Link
              href="/boards"
              className={buttonVariants({ variant: "default" })}
            >
              Generate Your Link
            </Link>
            <a
              href="#how-it-works"
              className={buttonVariants({ variant: "outline" })}
            >
              See How It Works
            </a>
          </motion.div>

          {/* Tagline badges */}
          <motion.div
            className="flex flex-wrap gap-4 mt-6 text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.3 }}
          >
            <span className="flex items-center gap-1">
              <Lock className="w-4 h-4" /> 100% Anonymous
            </span>
            <span className="flex items-center gap-1">
              <Share2 className="w-4 h-4" /> Easy to Share
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> Instant Replies
            </span>
          </motion.div>
        </div>

        {/* Illustration */}
        <div className="md:w-1/3 w-2/3 flex justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeIn" }}
            className="animate-bounce-1 relative"
          >
            {theme &&
              (theme === "dark" ? (
                <Image src={Illustration} alt="illustration" width={400} />
              ) : (
                <Image src={IllustrationDark} alt="illustration" width={400} />
              ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
