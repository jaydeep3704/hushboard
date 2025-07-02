"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormItem, FormLabel, FormMessage, FormField } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SigninSchema } from "@/zodSchema/authSchema"
import { Input } from "@/components/ui/input"
import { ArrowRight, Loader2, Eye, EyeOff, Mail, Lock } from "lucide-react"
import { OrSeperator } from "@/components/general/Seperator"
import Link from "next/link"
import type { z } from "zod"
import { AnimatedFeed } from "@/components/general/AnimatedFeed"
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react"
import { oAuthSignIn, SignIn } from "@/lib/auth/actions"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, Variants } from "framer-motion"

export  function SignInForm() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(SigninSchema),
  })

  const [pending, setPending] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const router = useRouter()

  async function onSubmit(data: z.infer<typeof SigninSchema>) {
    try {
      setPending(true)
      const result = await SignIn(data)
      if (!result?.success && result?.error) return toast.error(result.error)
      else if (result.success) return router.replace(result.redirectTo)
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        toast.error("An unexpected error occured")
      }
    } finally {
      setPending(false)
    }
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  return (
    <div className="grid lg:grid-cols-5 items-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-background dark:via-slate-900 dark:to-slate-800">
      {/* Left Side - Animated Feed */}
      <motion.div
        className="hidden lg:block lg:col-span-2 min-h-screen h-auto bg-gradient-to-br from-violet-50 to-cyan-50 dark:from-background dark:to-slate-900 justify-center items-center relative overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-violet-200/30 dark:bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-200/30 dark:bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 h-full flex items-center justify-center">
          <AnimatedFeed title="HushBoard" description={`"Speak your mind. Stay anonymous."`} />
        </div>
      </motion.div>

      {/* Right Side - Sign In Form */}
      <motion.div
        className="lg:col-span-3 overflow-hidden lg:rounded-l-4xl flex justify-center items-center min-h-screen bg-white dark:bg-card relative"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)]" />

        <motion.div
          className="relative z-10 w-full max-w-md px-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="w-full lg:border-none border border-slate-200/50 dark:border-slate-700/50 shadow-xl lg:shadow-none bg-white/80 dark:bg-card/90 backdrop-blur-sm">
            <CardHeader className="space-y-4 pb-8">
              <motion.div variants={itemVariants}>
                <CardTitle className="text-center">
                  <Link
                    className="flex justify-center font-bold text-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 dark:from-violet-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent"
                    href={"/"}
                  >
                    Welcome Back
                  </Link>
                </CardTitle>
              </motion.div>
              <motion.div variants={itemVariants}>
                <CardDescription className="text-center text-lg text-slate-600 dark:text-slate-300">
                  Sign in to continue to HushBoard
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="space-y-8">
              <Form {...form}>
                <motion.form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)} variants={itemVariants}>
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-violet-500" />
                            Email Address
                          </FormLabel>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder="johndoe@gmail.com"
                              className="pl-4 pr-4 py-3 text-base border-2 border-slate-200 dark:border-slate-700 focus:border-violet-500 dark:focus:border-violet-400 rounded-xl transition-all duration-200 bg-white/50 dark:bg-slate-800/50"
                            />
                          </div>
                          <FormMessage className="text-red-500 dark:text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-violet-500" />
                            Password
                          </FormLabel>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className="pl-4 pr-12 py-3 text-base border-2 border-slate-200 dark:border-slate-700 focus:border-violet-500 dark:focus:border-violet-400 rounded-xl transition-all duration-200 bg-white/50 dark:bg-slate-800/50"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                          <FormMessage className="text-red-500 dark:text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Button
                      type="submit"
                      disabled={pending}
                      className="w-full py-3 text-base font-semibold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 dark:from-violet-500 dark:to-purple-500 dark:hover:from-violet-600 dark:hover:to-purple-600 text-white border-0 rounded-xl shadow-lg shadow-violet-500/25 dark:shadow-violet-400/30 hover:shadow-xl hover:shadow-violet-500/40 dark:hover:shadow-violet-400/50 transition-all duration-300"
                    >
                      {pending ? (
                        <Loader2 className="animate-spin w-5 h-5" />
                      ) : (
                        <div className="flex items-center gap-2 justify-center">
                          Sign In
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </motion.form>
              </Form>

              <motion.div variants={itemVariants}>
                <OrSeperator />
              </motion.div>

              <motion.div className="space-y-3" variants={itemVariants}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Button className="w-full py-3 text-base font-medium border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl transition-all duration-200"
                  onClick={
                      async()=>{
                        console.log("google clicked")
                        await oAuthSignIn("google")
                      }
                    }
                  >
                    <IconBrandGoogle className="size-5" />
                    Continue with Google
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Button className="w-full py-3 text-base font-medium border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl transition-all duration-200"
                   onClick={
                      async()=>{
                        await oAuthSignIn("github")
                      }
                    }
                  >
                    <IconBrandGithub className="size-5" />
                    Continue with Github
                  </Button>

                </motion.div>
              </motion.div>
            </CardContent>

            <CardFooter className="pt-6">
              <motion.p
                className="text-base text-slate-600 dark:text-slate-300 flex gap-2 justify-center w-full"
                variants={itemVariants}
              >
                <span>Don't have an account?</span>
                <Link
                  href={"/sign-up"}
                  className="font-semibold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent hover:from-violet-700 hover:to-purple-700 dark:hover:from-violet-300 dark:hover:to-purple-300 transition-all duration-200"
                >
                  Create one here
                </Link>
              </motion.p>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
