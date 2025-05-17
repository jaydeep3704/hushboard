import { NextRequest,NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req:NextRequest,{params}:{params:{board_slug:string}}){
    const {userId}=await auth()
    const {board_slug}=params
    const {isAcceptingMessages}=await req.json()
    if(!userId){
      return NextResponse.json({
        error:"user is not authenticated"
      },{status:400})
    }

    try {
        
        const user=await prisma.user.findUnique(
            {
                where:{
                    id:userId
                }
            }
        )

        if(!user){
            return NextResponse.json({
                error:"user doesn't exist"
            },{status:400})
        }

        const board=await prisma.board.findUnique({
            where:{
                slug:board_slug
            }
        })

        if(!board){
            return NextResponse.json({error:"Board doesn't exist "},{status:400})
        }

        const updatedBoard=await prisma.board.update({
            where:{
                id:board.id,
                slug:board_slug,
                userId:userId
            },
            data:{
                isAcceptingMessages,
            }
        })

        return NextResponse.json({updatedBoard,message:"is Accepting Messages updated sucessfully "},{status:200})

    } catch (error) {
        return NextResponse.json({error:"An Error occured while updating isAcceptingMessages"},{status:500})
    }

}


export async function GET(req: NextRequest, { params }: { params: { board_slug: string } }) {
  const { board_slug } = params;
  console.log(board_slug)
  try {
    const board = await prisma.board.findUnique({
      where: {
        slug: board_slug
      },
      select: {
        isAcceptingMessages: true
      }
    });

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    return NextResponse.json({ isAcceptingMessages: board.isAcceptingMessages }, { status: 200 });

  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to fetch board status" }, { status: 500 });
  }
}
