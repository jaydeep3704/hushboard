"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from '@clerk/nextjs'
import { twMerge } from 'tailwind-merge'
import { AnimatePresence, motion } from "motion/react"
import { useScroll,useMotionValueEvent } from 'motion/react'
import { useAuth } from "@clerk/nextjs";

const Navbar = () => {

  const navLinks = [
    {
      label: "Home",
      href: "/"
    },
    {
    label: "Messages",
    href: "messages"
  },
  {
    label: "Boards",
    href: "boards"
  },
  
  {
    label: "Settings",
    href: "settings"
  }
  ]

  const session=useSession()
  const {signOut}=useAuth()

  const [showMenu, setShowMenu] = useState<boolean>(false);
  const { scrollYProgress } = useScroll()
 const[scrollVal,setScrollVal]=useState(0)
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollVal( latest)
  })
  return (
    <section className='py-10 px-[4%] fixed top-0 z-100 left-0 right-0'>


      <div className={twMerge('p-4 flex justify-between  mx-auto items-center max-w-5xl',scrollVal>0.05 && 'p-4 rounded-xl bg-secondary-foreground/70 backdrop-blur-sm transition ease-in-out border border-white/15 ' )}>
        <span className='text-lg'>HushBoard</span>
        <nav className='md:flex gap-10 hidden'>
          {
            navLinks.map((link) => {
              return <Link href={link.href} key={link.label}>{link.label}</Link>
            })
          }
        </nav>
        <div className='flex gap-5 items-center'>

         { !session.isSignedIn ? <Link href={'/signin'}>
            <button className='hover:opacity-70 transition bg-accent py-2 px-8 rounded-full text-primary cursor-pointer shimmer-effect  '>Sign In</button>
          </Link>
          :
          
            <button className='hover:opacity-70 transition bg-accent py-2 px-8 rounded-full text-primary cursor-pointer shimmer-effect  ' onClick={async()=>{
              await signOut()  
            }}>Sign Out</button>
          
      }

          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={twMerge("lucide lucide-menu-icon lucide-menu ", 'md:hidden')}
            onClick={() => setShowMenu(!showMenu)}

          >
            <line x1="3" y1="6" x2="21" y2="6" className={twMerge("origin-left transition", showMenu && "rotate-45  -translate-y-1")}></line>
            <line x1="3" y1="12" x2="21" y2="12" className={twMerge("transition", showMenu && "opacity-0")}></line>
            <line x1="3" y1="18" x2="21" y2="18" className={twMerge("origin-left transition", showMenu && "-rotate-45  translate-y-1")}></line>
          </svg>
        </div>
          
      </div>
      <AnimatePresence>
        {
          showMenu &&
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden bg-secondary-foreground/70 rounded-xl p-[4%] mt-5 backdrop-blur-sm border border-white/15 md:hidden"
          >


            <nav className='flex flex-col gap-5 overflow-hidden'>
              {
                navLinks.map((link) => {
                  return <Link href={link.href} key={link.label}>{link.label}</Link>
                })
              }
            </nav>
          </motion.div>
        }
      </AnimatePresence>

    </section>
  )
}

export default Navbar
