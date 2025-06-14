import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  return (
    <AuthenticateWithRedirectCallback
    signInForceRedirectUrl={"/boards"}
    signUpForceRedirectUrl={"/boards"}
    />
  );
}
