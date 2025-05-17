"use client"

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { CopyIcon, RefreshCcw, Trash2 } from 'lucide-react'
import { useSession } from '@clerk/nextjs'
import axios from "axios"
import Loader from '@/components/Loader'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'

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

import {motion} from "motion/react"
import { Message } from '@/generated/prisma'



const Page = () => {
  const params = useParams()
  const board_slug = params.board_slug as string
  const { session,isLoaded } = useSession()
  const [isAcceptingMessages,setIsAcceptingMessages]=useState<boolean>(true)
 
  const [boardInfo, setBoardInfo] = useState<any>(null)
  const [messages,setMessages]=useState<Message []>([])
  const [loading, setLoading] = useState(false)
  const baseURL = "http://localhost:3000"
  const [url, setUrl] = useState("")
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

  
  const getAcceptingMessages=async ()=>{
    try {
       const response=await axios.get(`/api/boards/${board_slug}/is-accepting-messages`)
       const data=await response.data
       setIsAcceptingMessages(data.isAcceptingMessages)
    } catch (error) {
       toast.error("Error fetching accepting messages status")  
    }
  }

  const setAcceptingMessages=async ()=>{
    try {
      const response=await axios.post(`/api/boards/${board_slug}/is-accepting-messages`,{isAcceptingMessages:!isAcceptingMessages})
      const data=await response.data
      console.log(data)
      if(response.status==200){
          setIsAcceptingMessages(!isAcceptingMessages)
          toast.success("Accepting Messages is set to "+(!isAcceptingMessages ? 'active' : 'inactive'))
      }
    } catch (error) {
      toast.error("Some Error occured ! Please try again later")
    }
  }


  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (board_slug) {
      fetchBoardInfo(); // Initial fetch
      getAcceptingMessages();
      intervalId = setInterval(fetchBoardInfo, 120000); // Repeat every 5 minutes
    }
  
    if (isLoaded && session) {
      setUrl(`${baseURL}/${session.user.username}/${board_slug || ""}`);
    }
  
    return () => {
      if (intervalId) clearInterval(intervalId); // Clear on unmount
    };
  }, [board_slug, isLoaded,fetchBoardInfo,session,getAcceptingMessages]);
  

  

const onDeleteMessage=async (id:string,slug:string)=>{
    
    try {
      const response=await axios.delete(`/api/boards/${slug}/messages/${id}`)
      const data=response.data
      console.log(data)
      if(response.status===200){
         setMessages(()=>messages.filter((message)=>message.id!==id))
         toast.success("Message deleted sucessfully")
      }
    } catch (error:any) {
        console.log("Error : ",error)
        toast.error("Error while deleting message")
    }
}

  return (
    <section className='py-16 md:py-24 md:px-0 px-[4%]'>
      <h1 className='text-center md:text-3xl text-2xl capitalize'>
        {board_slug ? board_slug.split("-").join(" ") : "Board not found"}
      </h1>
      <div className='max-w-4xl mx-auto'>
        <div className='flex items-center justify-between px-5 rounded-full my-10 bg-secondary-foreground py-2'>
          <input
            type="text"
            className='outline-none pr-5 w-full md:text-md text-sm'
            disabled
            value={url}
          />
          <CopyIcon className='size-5 cursor-pointer' onClick={() =>
            {
              if (navigator.clipboard) {
              navigator.clipboard.writeText(url).then(() => {
                toast.success("URL copied !")
              }).catch(err => {
                toast.error("Error copying URL try selecting the url")
              });
            } else {
              console.log("Clipboard API is not available.");
            }
            
            }
            } />
        </div>
        
          <div className='flex items-center gap-5 -mt-3'>
            Accept Messages 
            <Switch onCheckedChange={setAcceptingMessages} checked={isAcceptingMessages}/>
          </div>
           
        
        <div className='flex justify-center mt-5'>
          <button className='cursor-pointer flex items-center gap-3 bg-secondary-foreground py-1 px-3 rounded-md border border-white/15' onClick={fetchBoardInfo}>
          Refresh <RefreshCcw className='size-4'/></button>
        </div>    

        <div>
          {loading ? <BoardLoader /> :messages.length > 0 ?
            (<div className='mt-5 flex flex-col gap-5'>
              {
                messages.map((message:Message,index) => {
                  return (
                    <motion.div 
                     initial={{opacity:0,y:50,backdropFilter:"blur(20px)"}} animate={{opacity:100,y:0,backdropFilter:"blur(0px)"}} transition={{duration:0.4,delay:0.04*index,ease:"easeIn"}}
                    className='w-full py-3 px-10 rounded-md bg-secondary-foreground flex justify-between' key={message.id}>
                      <p className='md:text-md text-sm'>{message.content}</p>

                      <AlertDialog>
                        <AlertDialogTrigger className='absolute top-3 right-3'><Trash2 className=' cursor-pointer md:size-5 size-4' /></AlertDialogTrigger>
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
                    </motion.div>
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
