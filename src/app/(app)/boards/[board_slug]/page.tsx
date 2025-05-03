"use client"

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { CopyIcon, Trash2 } from 'lucide-react'
import { useSession } from '@clerk/nextjs'
import axios from "axios"
import Loader from '@/components/Loader'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


import { Message } from '@/generated/prisma'



const Page = () => {
  const params = useParams()
  const board_slug = params.board_slug as string
  const { session,isLoaded } = useSession()

 
  const [boardInfo, setBoardInfo] = useState<any>(null)
  const [messages,setMessages]=useState<Message []>([])
  const [loading, setLoading] = useState(false)
  const baseURL = "http://localhost:3000"
  const [url, setUrl] = useState("")
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
  
    const fetchBoardInfo = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/boards/${board_slug}/messages`);
        const data = await response.data;
        setBoardInfo(data);
        setMessages(data.messages);
      } catch (error) {
        console.error("Error fetching board info:", error);
      }
      setLoading(false);
    };
  
    if (board_slug) {
      fetchBoardInfo(); // Initial fetch
      intervalId = setInterval(fetchBoardInfo, 300000); // Repeat every 5 minutes
    }
  
    if (isLoaded && session) {
      setUrl(`${baseURL}/${session.user.username}/${board_slug || ""}`);
    }
  
    return () => {
      if (intervalId) clearInterval(intervalId); // Clear on unmount
    };
  }, [board_slug, isLoaded, session]);
  

  

const onDeleteMessage=async (id:string,slug:string)=>{
    
    try {
      const response=await axios.delete(`/api/boards/${slug}/messages/${id}`)
      const data=response.data
      console.log(data)
      if(response.status===200){
         setMessages(()=>messages.filter((message)=>message.id!==id))
      }
    } catch (error:any) {
        console.log("Error : ",error)
    }
}

  return (
    <section className='py-24 md:px-0 px-[4%]'>
      <h1 className='text-center text-3xl'>
        {board_slug ? board_slug.split("-").join(" ") : "Board not found"}
      </h1>
      <div className='max-w-4xl mx-auto'>
        <div className='flex items-center justify-between px-5 rounded-full my-10 bg-secondary-foreground py-2'>
          <input
            type="text"
            className='outline-none pr-5 w-full'
            disabled
            value={url}
          />
          <CopyIcon className='size-5 cursor-pointer' onClick={() => window.navigator.clipboard.writeText(url)} />
        </div>
        <div>
          {loading ? <BoardLoader /> :messages.length > 0 ?
            (<div className='mt-5 flex flex-col gap-5'>
              {
                messages.map((message:Message) => {
                  return (
                    <div className='w-full py-3 px-10 rounded-md bg-secondary-foreground flex justify-between' key={message.id}>
                      <p>{message.content}</p>

                      <AlertDialog>
                        <AlertDialogTrigger><Trash2 className=' cursor-pointer' /></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your message
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className='bg-accent hover:bg-accent/70' onClick={()=>onDeleteMessage(message.id,board_slug)} >Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )
                })
              }

            </div>):
            (
              <div className='max-w-4xl mx-auto text-center md:text-xl text-lg'>
                  No whispers yet — your board is waiting ....
              </div>
            )
            }
        </div>
      </div>
    </section>
  )
}

export default Page

const BoardLoader = () => {
  return (
    <div className='flex justify-center items-center flex-col gap-5 py-24'>
      <h3 className='text-xl md:text-3xl text-white/50 text-center'>"Just a sec... We're grabbing your board messages!"</h3>
      <Loader />
    </div>
  )
}
