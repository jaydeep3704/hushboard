"use client"
import { SunIcon,MoonIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import {motion} from "motion/react"
const ThemeToggle = () => {

 const [mounted,setMounted]=useState(false)   
 useEffect(()=>{
    setMounted(true)
 },[])
 const {theme,setTheme}=useTheme()
 
 if(!mounted) return null

  return (
    <div>
        {
            theme ==="dark" ?( 
           <motion.div
           className="size-10 rounded-full flex items-center justify-center bg-accent"
           initial={{
            rotate:-120
           }}
           animate={{
            rotate:0
           }}
           transition={
            {
                duration:0.4,
                type:"spring",
                mass:0.3
            }
           }
           onClick={()=>setTheme("light")}
           >
               <SunIcon className="size-6"/> 
           </motion.div>
        ): (<motion.div
           className="size-10 rounded-full flex items-center justify-center"
           initial={{
            rotate:-45
           }}
           animate={{
            rotate:0
           }}
           transition={
            {
                duration:0.4,
                type:"spring",
                mass:0.3
            }
           }
           onClick={()=>setTheme("dark")}
           >
               <MoonIcon className="size-6"/> 
           </motion.div>)
        }
    </div>
  )
}

export default ThemeToggle
