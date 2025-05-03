import { NextRequest,NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";


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



  export async function POST(req:NextRequest){
    
    const {username,slug,content}=await req.json()
    const user=await prisma.user.findUnique({
      where:{
        username
      }
    })

    if(!user){
      return NextResponse.json({error:"User not found"},{status:400})
    }
  
    try {
      
      const board=await prisma.board.findUnique({
        where:{
          userId:user.id,
          slug
        }
      })
  
    
      if(!board){
        return NextResponse.json({error:"Board doesn't exist"},{status:400})
      }

      if(!board.isAcceptingMessages){
        return NextResponse.json({error:` ${username} is currently not accepting any messages`},{status:400})
      }

      const newMessage=await prisma.message.create({
        data:{
          content,
          boardId:board.id,
          userId:user.id
        }
      })

      return NextResponse.json({newMessage,message:"Message created sucessfully"},{status:200})
    } 
    catch (error) {
       console.error('Error while creating message',error)
      return  NextResponse.json({error:"Error while creating message"},{status:500})
    }

  }
