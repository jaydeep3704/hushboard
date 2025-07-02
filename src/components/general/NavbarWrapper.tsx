import { getCurrentUser } from "@/lib/auth/currentUser"
import { Navbar } from "./Navbar"
import prisma from "@/lib/prisma"

async function getUserData(userId: string) {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true, email: true ,avatar:true},
    })
  } catch (error) {
    console.error("Error fetching user data:", error)
    return null
  }
}

export async function NavbarWrapper() {
  const user = await getCurrentUser()

  // 🛑 Prevent crash if user is not logged in
  if (!user || !user.id) {
    return <Navbar />
  }

  const userData = await getUserData(user.id)

  return <Navbar user={userData ?? undefined} />
}
