"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { ArrowRight, Menu, X, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"
import { ThemeToggle } from "./ThemeToggle"

// Dynamically import UserDropDown to prevent SSR issues
const UserDropDown = dynamic(() => import("./UserDropdown"), { ssr: false })

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Messages", href: "/messages" },
  { label: "Boards", href: "/boards" },
]

interface currentUserProps {
  user?: {
    username?: string
    email?: string
  }
}

export function Navbar({ user }: currentUserProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={cn(
        "sticky top-0 left-0 right-0 z-50 transition-all duration-300 ",
        isScrolled
          ? "bg-white/80 dark:bg-background/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 shadow"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 lg:h-20  px-4 md:px-0">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 rounded-lg flex items-center justify-center shadow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 dark:from-violet-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
              HushBoard
            </h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 rounded-xl font-medium transition-all duration-200",
                    isActive
                      ? "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  )}
                >
                  {link.label}
                </Link>

              )
            })}
          </nav>

          {/* Always show user dropdown in navbar */}
          <div className="flex items-center gap-3">
            <ThemeToggle/>
            {user ? <UserDropDown user={user} /> : (
              
                  <Link
                    href="/sign-in"
                    className=" items-center justify-center gap-2 w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl shadow hidden md:flex"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In <ArrowRight className="w-4 h-4" />
                  </Link>
                
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-700/50"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div className="px-4 py-6 space-y-4">
                {/* Mobile Navigation Links */}
                <div className="space-y-2">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        className={cn(
                          "block px-4 py-3 rounded-xl font-medium",
                          isActive
                            ? "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10"
                            : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    )
                  })}
                </div>

                {/* Sign In button in mobile only if user not logged in */}
                {!user && (
                  <Link
                    href="/sign-in"
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl shadow"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}