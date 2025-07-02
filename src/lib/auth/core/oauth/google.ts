import { OAuthClient } from "./base"
import { z } from "zod"

export function createGoogleOAuthClient() {
  return new OAuthClient({
    provider: "google",
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    scopes: ["openid", "email", "profile"],
    urls: {
      auth: "https://accounts.google.com/o/oauth2/v2/auth",
      token: "https://oauth2.googleapis.com/token",
      user: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    userInfo: {
      schema: z.object({
        sub: z.string(), // Google user ID
        email: z.string().email(),
        name: z.string(),
        picture: z.string().url(),
      }),
      parser: async (user, _accessToken) => {
        return {
          id: user.sub,
          email: user.email,
          avatar: user.picture,
          username: user.name, // You might want to slugify or shorten
        }
      },
    },
  })
}
