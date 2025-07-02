import { OAuthClient } from "./base";
import { OAuthProvider } from "@prisma/client";
import { z } from "zod";

export function createGithubOAuthClient() {
  return new OAuthClient({
    provider: "github",
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    scopes: ["read:user", "user:email"],
    urls: {
      auth: "https://github.com/login/oauth/authorize",
      token: "https://github.com/login/oauth/access_token",
      user: "https://api.github.com/user",
    },
    userInfo: {
      schema: z.object({
        id: z.number(),
        login: z.string(),
        email: z.string().nullable(),
        name: z.string().nullable(),
        avatar_url: z.string().url(),
      }),
      parser: async (user, accessToken) => {
        let email = user.email;

        if (!email) {
          const emails = await fetch("https://api.github.com/user/emails", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/vnd.github+json",
            },
          }).then((res) => res.json());

          const primary = emails.find((e: any) => e.primary && e.verified);
          if (!primary?.email) throw new Error("No verified email found");
          email = primary.email;
        }

        return {
          id: user.id.toString(),
          email,
          avatar: user.avatar_url,
          username: user.login,
        };
      },
    },
  });
}
