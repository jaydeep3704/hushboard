"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormItem, FormLabel, FormMessage, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema } from "@/zodSchema/authSchema";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader2 } from "lucide-react";
import { GeneralSubmitButton } from "@/components/general/SubmitButton";
import { OrSeperator } from "@/components/general/Seperator";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import Link from "next/link";
import { z } from "zod";
import { AnimatedFeed } from "@/components/general/AnimatedFeed";
import { SignUp } from "@/lib/auth/actions";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ValidationError } from "@/lib/utils/Error";
import { useRouter } from "next/navigation";
export default function SignUpPage() {

  const form = useForm<z.infer<typeof SignupSchema>>({
    defaultValues: {
      username:'',
      email: '',
      password: '',
      confirmPassword: ''
    },
    resolver: zodResolver(SignupSchema)
  })
  const [pending,setPending]=useState<boolean>(false)
  const router=useRouter()
  async function onSubmit(data: z.infer<typeof SignupSchema>) {
    try {
      setPending(true)
      const result=await SignUp(data)
      if(result.error && !result.success) return toast.error(result.error)
      else if(result?.success) return router.replace(result?.redirectTo)
    } 
    catch (error) {
      if(error instanceof Error && error.message!=="NEXT_REDIRECT"){
            return toast.error("Unexpected error")
      }
    }
    finally{
      setPending(false)
    }
  }


  return (
    <div className="grid lg:grid-cols-5 items-center min-h-screen bg-accent dark:bg-background">
      <div className="hidden lg:block lg:col-span-2 min-h-screen h-auto bg-accent dark:bg-background justify-center items-center">
        <AnimatedFeed title="Join Hushboard" description={`"Because everyone has something to say."`}/>
      </div>
      <div className="lg:col-span-3 overflow-hidden  lg:rounded-l-4xl flex justify-center items-center min-h-screen bg-card py-5">
        <Card className="lg:w-[500px]  w-[400px] lg:border-none border-[1px] border-primary/10 shadow-md lg:shadow-none">
          <CardHeader>
            <CardTitle >
              <Link className="flex justify-center font-semibold text-2xl" href={"/"}>Welcome to HushBoard</Link>
            </CardTitle>
            <CardDescription className="text-center text-balance ">Create an Account</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">

            <Form {...form}>
              <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-6">
                  <div className="grid lg:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="font-semibold">Username</FormLabel>
                          <Input {...field} placeholder="JohnDoe1234" />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="font-semibold">Email</FormLabel>
                          <Input {...field} placeholder="johndoe@gmail.com" />
                          <FormMessage />
                        </FormItem>
                      )}
                    />


                  </div>

                <div className="grid lg:grid-cols-2 gap-4">

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="font-semibold">Password</FormLabel>
                        <Input {...field} type="password" placeholder="JohnDoe@1234" />
                        <FormMessage />
                      </FormItem>
                    )}
                    />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="font-semibold">Confirm Password</FormLabel>
                        <Input {...field} type="password" placeholder="JohnDoe@1234" />
                        <FormMessage />
                      </FormItem>
                    )}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full mt-4 flex justify-center items-center" variant="outline">
                    {pending ? 
                    (<Loader2 className="animate-spin"/>):
                    (<div className="flex items-center gap-2 text-primary justify-center">
                      Sign Up 
                      <ArrowRight className="size-4"/>
                    </div>) 
                  }
                </Button>

              </form>
            </Form>
            <OrSeperator />
            <div className="space-y-3">
              <form action="">
                <GeneralSubmitButton
                  text="Sign in with Google"
                  icon={<IconBrandGoogle className="size-5" />}
                  classname="w-full text-primary"
                  iconFirst={true}
                  variant="outline"

                />
              </form>
              <form action="">
                <GeneralSubmitButton
                  text="Sign in with Github"
                  icon={<IconBrandGithub className="size-5" />}
                  classname="w-full text-primary"
                  variant="outline"
                  iconFirst={true}
                />
              </form>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground flex gap-2 justify-center w-full">
              <span> Already have an account ?  </span>
              <Link href={"/signin"} className="dark:text-primary/70 dark:hover:text-primary/50">Login here</Link> </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
