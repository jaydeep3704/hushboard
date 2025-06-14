import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function SSOCallbackPage() {
  return (
    <div className="flex w-screen h-screen justify-center">
    <AuthenticateWithRedirectCallback
    signInForceRedirectUrl={"/boards"}
    signUpForceRedirectUrl={"/boards"}
    />
    <div className="flex items-center justify-center flex-col gap-4s">
       <Loader2 className="animate-spin"/>
       <p className="text-muted-foreground">Signing In ...</p> 
    </div>
    </div>
  );
}
