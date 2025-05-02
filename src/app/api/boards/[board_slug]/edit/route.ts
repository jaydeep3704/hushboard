import { NextRequest,NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import slugify from 'slugify'
import { Prisma } from "@/generated/prisma";

export async  function POST(req:NextRequest){
   
    const {userId}=await auth()
    const {newBoardName,slug}=await req.json()


    if(!userId){
      return NextResponse.json({
        error:"user is not authenticated"
      },{status:400})
    }

 
    try {
      
      //check if the newBoardName already exists
      const newBoardSlug = slugify(newBoardName, { lower: true, strict: true })
      const existingBoard=await prisma.board.findUnique({
        where:{
            userId,
            slug:newBoardSlug 
        }
      })
      if(existingBoard){
        return NextResponse.json({error:"Please choose another name as a board with same name already exists"})
      }



      const newBoard=await prisma.board.update({
        where:{
          userId:userId,
          slug:slug
        },
        data:{
         name:newBoardName,
         slug:newBoardSlug
        }
      })

      return NextResponse.json({newBoard,message:'Board Name Updated'})
    } 
    catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          console.error('Board not found:', error);
          return NextResponse.json({ error: "Board doesn't exist" }, { status: 400 });
        }
      
        console.error('Failed to Update Board Name:', error);
        return NextResponse.json({ error: "Error while updating board name" }, { status: 500 });
      }
      
}


