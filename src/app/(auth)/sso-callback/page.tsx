"use client"
import { AuthenticateWithRedirectCallback, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SSOCallbackPage() {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const assignUsernameIfMissing = async () => {
      if (!user || !isLoaded) return;

      if (!user.username) {
        const base = (user.firstName || user.fullName || "user").toLowerCase().replace(/\s/g, "");
        const random = Math.floor(1000 + Math.random() * 9000); // 4-digit suffix
        const generated = `${base}${random}`;

        try {
          setUpdating(true);
          await user.update({ username: generated });
        } catch (err) {
          console.error("Username update failed:", err);
        }
      }

      router.push("/boards");
    };

    assignUsernameIfMissing();
  }, [isLoaded, user, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center flex-col">
      <AuthenticateWithRedirectCallback />
      <Loader2 className="w-6 h-6 animate-spin" />
      <p className="text-muted-foreground">Signing you in...</p>
    </div>
  );
}
