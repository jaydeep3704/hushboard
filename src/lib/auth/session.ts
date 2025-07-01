import { redis } from "../redis"
import { z } from "zod"

// ✅ Web Crypto Compatible Session ID Generator
function generateSessionId(): string {
    const bytes = new Uint8Array(64) // 512 bits = 64 bytes
    crypto.getRandomValues(bytes)
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('').normalize()
}

// ✅ Zod schema to validate session data
const sessionSchema = z.object({
    id: z.string(),
    email: z.string()
})

// ✅ Type for cookie handling abstraction
export type Cookies = {
    set: (
        key: string,
        value: string,
        options: {
            secure?: boolean,
            httpOnly?: boolean,
            sameSite?: "strict" | "lax",
            expires?: number
        }
    ) => void
    get: (key: string) => { name: string, value: string } | undefined
    delete: (key: string) => void
}

const SESSION_EXPIRATION_SECONDS = 7 * 24 * 60 * 60 // 7 days
const COOKIE_SESSION_KEY = "session-id"

// ✅ Create session and store in Redis
export async function createSession(user: z.infer<typeof sessionSchema>, cookies: Cookies) {
    const sessionId = generateSessionId()
    await redis.set(`session:${sessionId}`, sessionSchema.parse(user), {
        ex: SESSION_EXPIRATION_SECONDS
    })
    setCookie(sessionId, cookies)
}

// ✅ Fetch session by session ID
async function getUserSessionById(sessionId: string) {
    const rawUser = await redis.get(`session:${sessionId}`)
    const { data: user, success } = sessionSchema.safeParse(rawUser)
    return success ? user : null
}

// ✅ Remove session from Redis and cookie
export async function removeUserFromSession(cookies: Pick<Cookies, "get" | "delete">) {
    const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value
    if (sessionId == null) return null

    await redis.del(`session:${sessionId}`)
    cookies.delete(COOKIE_SESSION_KEY)
}

// ✅ Get user from session using cookie
export function getUserFromSession(cookies: Pick<Cookies, "get">) {
    const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value
    if (sessionId == null) return null
    return getUserSessionById(sessionId)
}

// ✅ Set session ID in cookie
function setCookie(sessionId: string, cookies: Pick<Cookies, "set">) {
    cookies.set(COOKIE_SESSION_KEY, sessionId, {
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000
    })
}
