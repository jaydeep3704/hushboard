import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";



export async function GET(req: NextRequest, { params }: { params: { board_slug: string } }) {
  const { board_slug } = await params
  const { userId } = await auth()
  

  if (!userId) {
    return NextResponse.json({
      error: "user is not authenticated"
    }, { status: 400 })
  }


  try {
    const board = await prisma.board.findUnique({
      where: {
        userId: userId,
        slug: board_slug
      },
    })

    if (!board) {
      return NextResponse.json({ error: "Board doesn't exist" }, { status: 400 })
    }

    const messages = await prisma.message.findMany({
      where: {
        boardId: board.id,
      },
      include: {
        user: true
      }
    })

  
    return NextResponse.json({ messages, message: "Messages fetched sucessfully" }, { status: 200 })


  }
  catch (error) {
   
    return NextResponse.json({ error: "Error while fetching message" }, { status: 500 })
  }

}
