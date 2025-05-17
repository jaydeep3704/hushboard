import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";



export async function DELETE(req: NextRequest, { params }: { params: Promise<{ board_slug: string }> }) {
  const { board_slug,id } = await params
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

    const message = await prisma.message.findUnique({
     where:{
        id
     }
    })

    if(!message){
        return NextResponse.json({error:"Message with the given id doesnt exist"},{status:400})
    }

    await prisma.message.delete({
        where:{
            userId,
            id
        }
    })
  
    return NextResponse.json({  message: "Messages deleted sucessfully" }, { status: 200 })


  }
  catch (error) {
   
    return NextResponse.json({ error: "Error while deleting message" }, { status: 500 })
  }

}
