import { NextRequest,NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(req:NextRequest){
     const {boardId}=await req.json()
     const {userId}=await auth()
     if(!userId){
        return NextResponse.json({error:"User not authenticated"},{status:401})
     }
     try {
        const existingBoard=await prisma.board.findUnique({
            where:{
                id:boardId,
                userId
            }
        })

        if(!existingBoard){
            return NextResponse.json({error:"Board doesn't exist"},{status:400})
        }

        const boardDeleted=await prisma.board.delete({
            where:{
                id:boardId,
                slug:existingBoard.slug
            }
        })

        return NextResponse.json({message:"Board Deleted Sucessfully",boardDeleted},{status:200})

     } catch (error) {
        
        console.log("Error while deleting board",error)
        return NextResponse.json({error:"Error while deleting board"},{status:500})
        
     }   
}

