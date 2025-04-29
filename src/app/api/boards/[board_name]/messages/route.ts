import { NextRequest,NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import slugify from 'slugify'

export async  function POST(req:NextRequest,{params}:{params:{boardName:string}}){
    const {boardName}=await params
    const {userId}=await auth()
    const {content}=await req.json()
    let slug = slugify(boardName, { lower: true, strict: true })

    if(!userId){
      return NextResponse.json({
        error:"user is not authenticated"
      },{status:400})
    }

 
    try {
      const board=await prisma.board.findUnique({
        where:{
          userId:userId,
          slug:slug
        }
      })

      if(!board){
        return NextResponse.json({error:"Board doesn't exist"},{status:400})
      }

      const anonymous_message=await prisma.message.create({
        data:{
          boardId:board?.id,
          userId:userId,
          content:content,
        }
      })

      console.log(anonymous_message)
      return NextResponse.json({anonymous_message,message:"Message created sucessfully"},{status:201})

      
    } 
    catch (error) {
       console.error('Error while creating message',error)
      return  NextResponse.json({error:"Error while creating message"},{status:500})
    }
}

export async function GET(req:NextRequest,{params}:{params:{boardName:string}}){
  const {boardName}=await params
  const {userId}=await auth()
  let slug = slugify(boardName, { lower: true, strict: true })

  if(!userId){
    return NextResponse.json({
      error:"user is not authenticated"
    },{status:400})
  }


  try {
    const board=await prisma.board.findUnique({
      where:{
        userId:userId,
        slug:slug
      }
    })

    if(!board){
      return NextResponse.json({error:"Board doesn't exist"},{status:400})
    }

    const messages=await prisma.message.findMany({
      where:{
        boardId:board.id,
      },
      include:{
        user:true
      }
    })

    console.log(messages)
    return NextResponse.json({messages,message:"Messages fetched sucessfully"},{status:200})

    
  } 
  catch (error) {
     console.error('Error while fetching message',error)
    return  NextResponse.json({error:"Error while fetching message"},{status:500})
  }

}
