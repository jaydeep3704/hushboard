import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(req:NextRequest,{params}:{params:{board_slug:string}}){

     const {userId}=await auth()
    const {board_slug}=await params 

     if(!userId){
        return NextResponse.json({error:"User not authenticated"},{status:401})
     }
     try {
        const existingBoard=await prisma.board.findUnique({
            where:{
                slug:board_slug,
                userId
            }
        })

        if(!existingBoard){
            return NextResponse.json({error:"Board doesn't exist"},{status:400})
        }

        const boardDeleted=await prisma.board.delete({
            where:{
                id:existingBoard.id,
                slug:board_slug
            }
        })

        return NextResponse.json({message:"Board Deleted Sucessfully",boardDeleted},{status:200})

     } 
     catch (error) {
        return NextResponse.json({error:"Error while deleting board"},{status:500})
     }   
}

