"use client"

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { SendIcon } from 'lucide-react'
import axios from "axios"
import Loader from '@/components/Loader'
import { delay, motion } from "motion/react"
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'

const Page = () => {
  const { username, slug } = useParams()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedMessages, setGeneratedMessages] = useState([])
  const[generatingMessages,setGeneratingMessages]=useState<boolean>(false)
  const [userAcceptingMessages,setUserAcceptingMessages]=useState<boolean>(true)

  const onSendMessage = async (e: any) => {
    e.preventDefault()

    setLoading(true)
    if (!content) {
      setLoading(false)
      toast.error("Message should not be empty")
      return;
    }
    else if(content.length>150){
      setLoading(false)
      return
    }
    getAcceptingMessages()
    if(!userAcceptingMessages){
      setLoading(false)
      return toast.error("User is currently not accepting any messages")
    }
    


    try {
      const response = await axios.post("/api/messages", { slug, username, content })
      const data = await response.data
      if(response.status==200){
        toast.success("Message sent sucessfully")
      }
      else{
        toast.error("Some error occured while sending message . wait for some time or try again")
      }
      console.log(data)
    } catch (error: any) {
      console.log("Error :", error)
    }
    setLoading(false)
  }

  useEffect(() => {
    generateMessages()
    getAcceptingMessages()
  }, [])

  const generateMessages = async () => {
    setGeneratingMessages(true)
    try {
      const response = await axios.post("/api/gemini-generate-messages", { slug })
      if (response.status == 200) {
        const data = await response.data
        const messages = await data.generatedMessages.split("||")
        setGeneratedMessages(messages)
      }
    } catch (error) {
      console.log("Error :", error)
    }
    setGeneratingMessages(false)
  }

  const getAcceptingMessages=async ()=>{
    try {
       const response=await axios.get(`/api/boards/${slug}/is-accepting-messages`)
       const data=await response.data
       await setUserAcceptingMessages(data.isAcceptingMessages)
    } catch (error) {
       toast.error("Error fetching accepting messages status")  
    }
  }

  return (
    <section className='py-24 px-[4%] md:px-0'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-center text-lg md:text-2xl'>Send Message to {username}</h1>

        <div className='mt-5'>
          <Textarea
            name="content"
            id="content"
            className='w-full p-5 outline-none rounded-xl border border-white/15'
            placeholder='write your message here'
            rows={7}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {content.length > 150 && (
            <p className='text-white/50 text-sm'>Your message must contain less than 150 characters</p>
          )}
        </div>

        <button
          className='flex gap-3 items-center px-10 py-2 bg-accent text-primary rounded-md w-[250px] justify-center mx-auto mt-5 cursor-pointer hover:opacity-70 transition'
          onClick={onSendMessage}
        >
          {
            loading ? <Loader /> : <span className='flex items-center gap-3'> Send Message <SendIcon className='size-5' /></span>
          }
        </button>
      </div>

      <div className='max-w-4xl mx-auto py-10'>
        <h3 className='md:text-xl text-lg  text-center'>Not sure what to say? Here's a spark</h3>
        <p className='text-muted-foreground text-xs md:text-sm text-center mt-3'>Click on one of the message below to copy it to your input</p>
        <div className='flex flex-col gap-3 mt-5'>
          
          { !generatingMessages ?
             generatedMessages.length > 0 && (
              generatedMessages.map((message: string, messageIndex) => (
                <motion.p
                  key={messageIndex}
                  className="py-2 bg-card border px-5 rounded-md my-2 md:text-md text-sm cursor-pointer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: messageIndex * 0.8 }}
                  onClick={()=>{
                    setContent(message)
                    toast.success("Message copied to input")
                  }}
                >
                  {message.split(" ").map((word, wordIndex) => (
                    <motion.span
                      key={`${messageIndex}-${wordIndex}`}
                      initial={{ opacity: 0 ,backdropFilter:"blur(10px)"}}
                      animate={{ opacity: 1 ,backdropFilter:"blur(0px)"}}
                      transition={{ delay: messageIndex * 1 + wordIndex * 0.04 }}
                    >
                      {" " + word + " "}
                    </motion.span>
                  ))}
                </motion.p>
              ))
            ):
            (<div className='flex flex-col gap-3 items-center py-20'>
               <h3 className='text-center md:text-lg text-md'>Generating Messages Please Wait ....</h3>
               <Loader/>
            </div>)
          }
        </div>

      </div>
    </section>
  )
}

export default Page
