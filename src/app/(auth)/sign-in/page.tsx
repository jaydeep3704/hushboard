import { SignInForm } from "@/components/forms/SignInForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ oauthError?: string }>
}) {
  const { oauthError } = await searchParams
  if (oauthError) {
    const decodedError = decodeURIComponent(oauthError)
    console.log(decodedError)
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-red-900">Authentication Error</CardTitle>
            <CardDescription className="text-red-700">There was a problem signing you in</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-red-200 p-4">
              <p className="text-sm text-red-800 font-semibold">
                {decodedError || "An unexpected error occurred during authentication."}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button asChild className="w-full bg-violet-400 hover:bg-violet-400/70">
                <Link href="/sign-in">Try Again</Link>
              </Button>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    
      <SignInForm />
    
  )
}
