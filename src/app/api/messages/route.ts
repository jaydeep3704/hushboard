import { NextRequest,NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";


export async function GET(req:NextRequest){
    
    const {userId}=await auth()
    
  
    if(!userId){
      return NextResponse.json({
        error:"user is not authenticated"
      },{status:400})
    }
  
  
    try {
      const messages=await prisma.message.findMany({
        where:{
          userId:userId,
        },
        include:{
          user:true,
          board:true
        }
      })
  
      console.log(messages)
      if(!messages){
        return NextResponse.json({error:"Error while fetching messages"},{status:400})
      }

      return NextResponse.json({messages,message:"Messages fetched sucessfully"},{status:200})
    } 
    catch (error) {
       console.error('Error while fetching message',error)
      return  NextResponse.json({error:"Error while fetching message"},{status:500})
    }
  
  }