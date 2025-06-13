"use client"
import React, { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import {motion} from 'motion/react'
const DarkMode = () => {
  
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null // Avoid rendering on server

  const onMoonClick=async ()=>{
    setTheme("dark")
  }

  const onSunClick=async()=>{
    setTheme("light")
  }


  return (
    <div>
      {
        theme === "light" ?
          <motion.div onClick={onMoonClick} 
          initial={{rotate:180}} 
          animate={{rotate:0}} 
          transition={{duration:0.4,type:"spring",bounce:0.3,mass:0.7}}
          key={"moon"}
          className='size-10 flex justify-center items-center rounded-full bg-card shadow-sm'
          >

            <Moon  /> 
          </motion.div>
          : 
          <motion.div onClick={onSunClick}
          initial={{rotate:180}} 
          animate={{rotate:0}} 
          transition={{duration:0.4,type:"spring",bounce:0.3,mass:0.7}}
          key={"sun"}
          className='size-10 flex justify-center items-center rounded-full bg-card'
          >
            <Sun   /> 
          </motion.div>
      }
    </div>
  )
}

export default DarkMode
