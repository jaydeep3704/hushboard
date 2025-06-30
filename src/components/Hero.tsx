"use client"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { Lock, Share2, MessageCircle, Shield, Zap, ArrowRight, Sparkles } from "lucide-react"
import { Variants } from "framer-motion"
const Hero = () => {
  const { theme } = useTheme()

  const features = [
    { icon: Lock, text: "100% Anonymous", color: "text-emerald-500 dark:text-emerald-400" },
    { icon: Zap, text: "Instant Messages", color: "text-amber-500 dark:text-amber-400" },
    { icon: Shield, text: "Secure & Private", color: "text-blue-500 dark:text-blue-400" },
  ]

  const containerVariants:Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants:Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const floatingVariants:Variants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, 0, -5, 0],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-background dark:via-slate-900 dark:to-slate-800 py-10">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        {/* Primary gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-500/5 dark:from-violet-400/10 dark:via-transparent dark:to-cyan-400/10" />

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-violet-400/20 to-purple-600/20 dark:from-violet-400/30 dark:to-purple-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-400/20 to-blue-600/20 dark:from-cyan-400/30 dark:to-blue-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center max-w-7xl mx-auto">
          {/* Content Section */}
          <motion.div
            className="flex flex-col space-y-8 text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="flex justify-center lg:justify-start">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-100 to-cyan-100 dark:from-violet-500/20 dark:to-cyan-500/20 border border-violet-200/50 dark:border-violet-500/30 rounded-full px-4 py-2 backdrop-blur-sm shadow-lg shadow-violet-500/10 dark:shadow-violet-400/20">
                <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                  Anonymous Messaging Platform
                </span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight">
                <span className="block text-slate-900 dark:text-white leading-[0.9]">Say What</span>
                <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 dark:from-violet-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent leading-[0.9]">
                  Matters
                </span>
                <span className="block text-slate-600 dark:text-slate-300 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light leading-[0.9] mt-2">
                  anonymously
                </span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              Get honest feedback without revealing who you are.{" "}
              <span className="font-semibold bg-gradient-to-r from-violet-600 to-cyan-600 dark:from-violet-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Share your link and receive anonymous messages instantly.
              </span>
            </motion.p>

            {/* Feature Pills */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 bg-white/80 dark:bg-card/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-full px-5 py-3 shadow-lg shadow-slate-200/20 dark:shadow-slate-900/40"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                  <span className="font-medium text-slate-700 dark:text-slate-200">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="group">
                <Link
                  href="/boards"
                  className={`${buttonVariants({ size: "lg" })} text-lg px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 dark:from-violet-500 dark:to-purple-500 dark:hover:from-violet-600 dark:hover:to-purple-600 shadow-xl shadow-violet-500/25 dark:shadow-violet-400/30 hover:shadow-2xl hover:shadow-violet-500/40 dark:hover:shadow-violet-400/50 transition-all duration-300 group-hover:-translate-y-0.5`}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Generate Your Link
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <a
                  href="#how-it-works"
                  className={`${buttonVariants({ variant: "outline", size: "lg" })} text-lg px-8 py-4 border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300`}
                >
                  See How It Works
                </a>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.5 }}
          >
            <div className="relative">
              {/* Main glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/30 via-purple-500/30 to-cyan-500/30 dark:from-violet-400/40 dark:via-purple-400/40 dark:to-cyan-400/40 rounded-full blur-3xl scale-110 animate-pulse" />

              {/* Secondary glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-400/20 to-cyan-400/20 dark:from-violet-300/30 dark:to-cyan-300/30 rounded-full blur-2xl scale-125" />

              {/* Main illustration container */}
              <motion.div className="relative z-10 p-8" variants={floatingVariants} animate="animate">
                <div className="relative w-80 h-96 lg:w-96 lg:h-[480px]">
                  {/* Enhanced phone mockup */}
                  <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-card dark:to-slate-800 rounded-3xl border border-slate-300/50 dark:border-slate-600/50 backdrop-blur-sm shadow-2xl shadow-violet-500/20 dark:shadow-violet-400/30 flex items-center justify-center overflow-hidden">
                    {/* Phone screen content */}
                    <div className="text-center space-y-6 p-8">
                      <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-purple-600 dark:from-violet-400 dark:to-purple-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-violet-500/30 dark:shadow-violet-400/40">
                        <MessageCircle className="w-12 h-12 text-white" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                          Anonymous Messages
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">Secure & Private</div>
                      </div>

                      {/* Mock message bubbles */}
                      <div className="space-y-3 mt-6">
                        <div className="bg-violet-100 dark:bg-violet-500/20 rounded-2xl p-3 text-left">
                          <div className="text-xs text-slate-600 dark:text-slate-300">"Great work on the project!"</div>
                        </div>
                        <div className="bg-cyan-100 dark:bg-cyan-500/20 rounded-2xl p-3 text-left">
                          <div className="text-xs text-slate-600 dark:text-slate-300">
                            "Your presentation was amazing"
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced floating elements */}
              <motion.div
                className="absolute top-16 -left-8 bg-white/90 dark:bg-card/90 backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-500/30 rounded-2xl p-4 shadow-xl shadow-emerald-500/10 dark:shadow-emerald-400/20"
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 3, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                <Lock className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
              </motion.div>

              <motion.div
                className="absolute bottom-24 -right-8 bg-white/90 dark:bg-card/90 backdrop-blur-sm border border-cyan-200/50 dark:border-cyan-500/30 rounded-2xl p-4 shadow-xl shadow-cyan-500/10 dark:shadow-cyan-400/20"
                animate={{
                  y: [0, 15, 0],
                  rotate: [0, -3, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                <Share2 className="w-8 h-8 text-cyan-500 dark:text-cyan-400" />
              </motion.div>

              <motion.div
                className="absolute top-1/2 -right-12 bg-white/90 dark:bg-card/90 backdrop-blur-sm border border-amber-200/50 dark:border-amber-500/30 rounded-2xl p-4 shadow-xl shadow-amber-500/10 dark:shadow-amber-400/20"
                animate={{
                  x: [0, 10, 0],
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 1.5,
                }}
              >
                <Zap className="w-8 h-8 text-amber-500 dark:text-amber-400" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
