import Link from "next/link"
import { Button, buttonVariants } from "../ui/button"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import { getCurrentUser } from "@/lib/auth/currentUser"
import UserDropDown from "./UserDropdown"
import { ThemeToggle } from "./ThemeToggle"

const navLinks = [
    {
      label: "Home",
      href: "/"
    },
    {
    label: "Messages",
    href: "/messages"
  },
  {
    label: "Boards",
    href: "/boards"
  },
  ]

export async function Navbar(){

  const user=await getCurrentUser()

  return(
  <div className="bg-card sticky top-0 left-0 right-0 z-70 border-b border-primary/10">
    <div className="max-w-7xl mx-auto py-5 flex items-center justify-between px-4 bg-card">
        <h1 className="text-2xl font-semibold">HushBoard</h1>
        <nav className="hidden md:block">
          {
            navLinks.map((link)=>(
              <Link href={link.href} key={link.label} className= {cn(buttonVariants({variant:"ghost",size:"lg"}),"text-md")}>
                {link.label}
              </Link>
            ))
          }
        </nav>
        <div className="flex gap-4">
          <ThemeToggle/>
           {
            !user ?
            (
            <Link className={cn(buttonVariants({variant:"outline"}),"group")} href={'/signin'}>
                Sign In
                <ArrowRight className="group-hover:translate-x-[3px] transition"/>
           </Link>
            ):
            <UserDropDown/>
           }  
        </div>
     </div>
    </div>
  )
}