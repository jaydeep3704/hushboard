

import Link from 'next/link';
import React from 'react'
import { LinkedinIcon, Twitter } from 'lucide-react';
import { GithubIcon } from 'lucide-react';
import { TwitterIcon } from 'lucide-react';
const Footer = () => {

    const sitemap = [
        {
          title: "Home",
          path: "/"
        },
        {
          title: "About",
          path: "/about"
        },
        {
          title: "Boards",
          path: "/boards"
        },
        {
          title: "Messages",
          path: "/messages"
        },
        {
          title: "Customize Page",
          path: "/customize"
        },
        {
          title: "Settings",
          path: "/settings"
        }
      ];
      
      

  return (
    <section className='py-20 px-[4%]'>
        <div className='grid max-w-5xl mx-auto md:grid-cols-4 justify-between grid-cols-2 gap-10'>
            <div className='font-semibold text-lg'>
                HushBoard
                <p className='text-sm text-white/50 font-medium mt-2'>Speak freely. Stay anonymous.</p>
            </div>
            <div>
                <h3 className='text-md'>Sitemap</h3>
                <ul className='flex flex-col text-sm text-white/50' >
                    {
                        sitemap.map((link)=><Link href={link.path} key={link.title}>{link.title}</Link>)
                    }
                </ul>
            </div>
            <div className='flex flex-col gap-3'>
            

                <div>
                    <h3 className='text-md'>Contact</h3>
                     <p className='text-white/50 text-sm'>
                        hushtechnologies@gmail.com
                     </p>
                </div>
            </div>

                <div className='flex flex-col gap-2'>

                    <h3 className='text-md'>Social</h3>
                    <div className='flex gap-5'>
                    <LinkedinIcon className='size-4'/>
                    <GithubIcon className='size-4'/>
                    <TwitterIcon className='size-4'/>
                    </div>
                </div>
        </div>
                <p className='mt-10 text-center'>Made with ❤️ by <Link href={"https://github.com/jaydeep3704"}>Jaydeep Patil </Link></p>
    </section>
  )
}

export default Footer
