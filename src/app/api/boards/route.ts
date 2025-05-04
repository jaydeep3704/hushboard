import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import slugify from 'slugify'

export async function POST(req: NextRequest) {
   
      
        const { userId } = await auth()
        const { boardName } = await req.json()


        let slug = slugify(boardName, { lower: true, strict: true })


        if (!userId) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
        }

        try {
   
        const existingBoard = await prisma.board.findFirst({
            where: {
                userId: userId,
                slug: slug
            }
        })

        if (existingBoard) {
            return NextResponse.json({ error: "Board already exists" }, { status: 400 })
        }

        const newBoard = await prisma.board.create({
            data: {
                name: boardName,
                slug: slug,
                userId: userId
            }
        })

        return NextResponse.json(newBoard, { status: 201 })

    } catch (error) {
        console.error("Error creating board:", error)
        return NextResponse.json({ error: "An error occurred while creating the board" }, { status: 500 })
    }
}

export async function GET(req: NextRequest) {
   
      
    const { userId } = await auth()


    if (!userId) {
        return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    try {
    
     const boards=await prisma.board.findMany({
        where:{
            userId
        },
        include:{
            messages:true
        }
     })

    return NextResponse.json(boards, { status: 200 })

} catch (error) {
    console.error("Error creating board:", error)
    return NextResponse.json({ error: "An error occurred while creating the board" }, { status: 500 })
}
}


