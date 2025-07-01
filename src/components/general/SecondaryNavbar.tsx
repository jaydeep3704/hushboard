"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { ArrowLeft, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { ThemeToggle } from "./ThemeToggle"

interface SecondaryNavbarProps {
  backHref?: string
  backLabel?: string
}

export function SecondaryNavbar({ backHref = "/", backLabel = "Back to Home" }: SecondaryNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={cn(
        " z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/80 dark:bg-background/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 shadow"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 lg:h-20 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 rounded-lg flex items-center justify-center shadow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 dark:from-violet-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
              HushBoard
            </h1>
          </Link>

          {/* Right side with back button and theme toggle */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href={backHref}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{backLabel}</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
