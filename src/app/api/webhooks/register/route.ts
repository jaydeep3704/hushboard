import {Webhook} from "svix"
import { WebhookEvent } from "@clerk/nextjs/server"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req:NextRequest){
    const WEBHOOK_SECRET=process.env.WEBHOOK_SECRET_KEY
    console.log(WEBHOOK_SECRET)
    if(!WEBHOOK_SECRET){
        throw new Error("Please add webhook secret in .env ")
    }

    const headerPayload=await headers()
    const svix_id=headerPayload.get("svix-id")
    const svix_timestamp=headerPayload.get("svix-timestamp")
    const svix_signature=headerPayload.get("svix-signature")

    if(!svix_id || !svix_timestamp || !svix_signature){
        return  NextResponse.json({error:"Error occurred no svix headers"})
    }

    const payload=await req.json()
    const body=JSON.stringify(payload)

    const wh=new Webhook(WEBHOOK_SECRET)

    let evt:WebhookEvent;

    try {
        evt=wh.verify(body,{
            "svix-id":svix_id,
            "svix-signature":svix_signature,
            "svix-timestamp":svix_timestamp
        }) as WebhookEvent


    } catch (error) {
        console.error("Error : error verifying webhook",error)
        return  NextResponse.json({error:"Error occurred no svix headers"},{status:400})
    }


    const {id}=evt.data  
    const eventType=evt.type

    if(eventType==="user.created"){
        try {
              const {email_addresses,primary_email_address_id}=evt.data
              const username = evt.data.username || "defaultUsername";  // Fallback if null

              const primaryEmail=email_addresses.find((email)=>email.id===primary_email_address_id)

              if(!primaryEmail){
                return NextResponse.json({error:"No Primary Email Found"},{status:400})
              }
    

              const newUser=await prisma.user.create({
               data:{
                id:evt.data.id,
                email:primaryEmail.email_address,
                username:username as string
               }
              })
              console.log("User created in neon db",newUser)
              
        } catch (error) {
            return NextResponse.json({error:"Error Creating User in database"},{status:400})
        }
    }

    return NextResponse.json({message:"Webhook recieved successfully"},{status:200})

}