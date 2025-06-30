"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormItem, FormLabel, FormMessage, FormField } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SignupSchema } from "@/zodSchema/authSchema"
import { Input } from "@/components/ui/input"
import { ArrowRight, Loader2, Eye, EyeOff, User, Mail, Lock, Shield } from "lucide-react"
import { GeneralSubmitButton } from "@/components/general/SubmitButton"
import { OrSeperator } from "@/components/general/Seperator"
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react"
import Link from "next/link"
import type { z } from "zod"
import { AnimatedFeed } from "@/components/general/AnimatedFeed"
import { SignUp } from "@/lib/auth/actions"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { motion, Variants } from "framer-motion"

export default function SignUpPage() {
  const form = useForm<z.infer<typeof SignupSchema>>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(SignupSchema),
  })

  const [pending, setPending] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const router = useRouter()

  async function onSubmit(data: z.infer<typeof SignupSchema>) {
    try {
      setPending(true)
      const result = await SignUp(data)
      if (result.error && !result.success) return toast.error(result.error)
      else if (result?.success) return router.replace(result?.redirectTo)
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        return toast.error("Unexpected error")
      }
    } finally {
      setPending(false)
    }
  }

  const containerVariants:Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants:Variants = {
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
        className="hidden lg:block lg:col-span-2 min-h-screen h-auto bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-background dark:to-slate-900 justify-center items-center relative overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-200/30 dark:bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-teal-200/30 dark:bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-emerald-200/20 to-teal-200/20 dark:from-emerald-500/5 dark:to-teal-500/5 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="relative z-10 h-full flex items-center justify-center">
          <AnimatedFeed title="Join HushBoard" description={`"Because everyone has something to say."`} />
        </div>
      </motion.div>

      {/* Right Side - Sign Up Form */}
      <motion.div
        className="lg:col-span-3 overflow-hidden lg:rounded-l-4xl flex justify-center items-center min-h-screen bg-white dark:bg-card relative py-8"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)]" />

        <motion.div
          className="relative z-10 w-full max-w-lg px-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="w-full lg:border-none border border-slate-200/50 dark:border-slate-700/50 shadow-xl lg:shadow-none bg-white/80 dark:bg-card/90 backdrop-blur-sm">
            <CardHeader className="space-y-4 pb-8">
              <motion.div variants={itemVariants}>
                <CardTitle className="text-center">
                  <Link
                    className="flex justify-center font-bold text-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent"
                    href={"/"}
                  >
                    Join HushBoard
                  </Link>
                </CardTitle>
              </motion.div>
              <motion.div variants={itemVariants}>
                <CardDescription className="text-center text-lg text-slate-600 dark:text-slate-300">
                  Create your anonymous messaging account
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="space-y-8">
              <Form {...form}>
                <motion.form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)} variants={itemVariants}>
                  <div className="space-y-6">
                    {/* Username and Email Row */}
                    <div className="grid lg:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                              <User className="w-4 h-4 text-emerald-500" />
                              Username
                            </FormLabel>
                            <Input
                              {...field}
                              placeholder="JohnDoe1234"
                              className="pl-4 pr-4 py-3 text-base border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 rounded-xl transition-all duration-200 bg-white/50 dark:bg-slate-800/50"
                            />
                            <FormMessage className="text-red-500 dark:text-red-400" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                              <Mail className="w-4 h-4 text-emerald-500" />
                              Email
                            </FormLabel>
                            <Input
                              {...field}
                              placeholder="johndoe@gmail.com"
                              className="pl-4 pr-4 py-3 text-base border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 rounded-xl transition-all duration-200 bg-white/50 dark:bg-slate-800/50"
                            />
                            <FormMessage className="text-red-500 dark:text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Password and Confirm Password Row */}
                    <div className="grid lg:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                              <Lock className="w-4 h-4 text-emerald-500" />
                              Password
                            </FormLabel>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                placeholder="Create password"
                                className="pl-4 pr-12 py-3 text-base border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 rounded-xl transition-all duration-200 bg-white/50 dark:bg-slate-800/50"
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

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                              <Shield className="w-4 h-4 text-emerald-500" />
                              Confirm Password
                            </FormLabel>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm password"
                                className="pl-4 pr-12 py-3 text-base border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 rounded-xl transition-all duration-200 bg-white/50 dark:bg-slate-800/50"
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                              >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                            <FormMessage className="text-red-500 dark:text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Button
                      type="submit"
                      disabled={pending}
                      className="w-full py-3 text-base font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 dark:from-emerald-500 dark:to-teal-500 dark:hover:from-emerald-600 dark:hover:to-teal-600 text-white border-0 rounded-xl shadow-lg shadow-emerald-500/25 dark:shadow-emerald-400/30 hover:shadow-xl hover:shadow-emerald-500/40 dark:hover:shadow-emerald-400/50 transition-all duration-300"
                    >
                      {pending ? (
                        <Loader2 className="animate-spin w-5 h-5" />
                      ) : (
                        <div className="flex items-center gap-2 justify-center">
                          Create Account
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
                  <form action="">
                    <GeneralSubmitButton
                      text="Continue with Google"
                      icon={<IconBrandGoogle className="w-5 h-5" />}
                      classname="w-full py-3 text-base font-medium border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl transition-all duration-200"
                      iconFirst={true}
                      variant="outline"
                    />
                  </form>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <form action="">
                    <GeneralSubmitButton
                      text="Continue with GitHub"
                      icon={<IconBrandGithub className="w-5 h-5" />}
                      classname="w-full py-3 text-base font-medium border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl transition-all duration-200"
                      variant="outline"
                      iconFirst={true}
                    />
                  </form>
                </motion.div>
              </motion.div>
            </CardContent>

            <CardFooter className="pt-6">
              <motion.p
                className="text-base text-slate-600 dark:text-slate-300 flex gap-2 justify-center w-full"
                variants={itemVariants}
              >
                <span>Already have an account?</span>
                <Link
                  href={"/signin"}
                  className="font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent hover:from-emerald-700 hover:to-teal-700 dark:hover:from-emerald-300 dark:hover:to-teal-300 transition-all duration-200"
                >
                  Sign in here
                </Link>
              </motion.p>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
