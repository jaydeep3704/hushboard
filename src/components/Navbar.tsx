"use client"
import React from 'react'
import Link from 'next/link'

const Navbar = () => {

  const navLinks=[{
    label:"Messages",
    href:"messages"
  },
  {
      label:"Boards",
      href:"boards"
  },
  {
    label:"Customize Page",
    href:"customize_page"
  },
  {
    label:"Settings",
    href:"settings"
  }
]  

  return (
    <section className='py-10 px-[4%] '>
        <div className='flex justify-between  mx-auto items-center max-w-5xl'>
            <span className='text-lg'>HushBoard</span>
            <nav className='md:flex gap-10 hidden'>
                {
                    navLinks.map((link)=>{
                        return <Link href={link.href} key={link.label}>{link.label}</Link>
                    })
                }
            </nav>
            <div className='flex gap-5'>
                
                <Link href={'/signin'}>
                  <button className='bg-accent py-2 px-8 rounded-full text-primary cursor-pointer shimmer-effect  '>Sign In</button> 
                </Link>
                  
            </div>
        </div>
    </section>
  )
}

export default Navbar
