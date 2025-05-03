"use client"

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { SendIcon } from 'lucide-react'
import axios from "axios"
import Loader from '@/components/Loader'
const Page = () => {
  const { username,slug } = useParams()
  const [content, setContent] = useState('')
  const [loading,setLoading]=useState(false)
  const onSendMessage = async (e: any) => {
    e.preventDefault()
   
    setLoading(true)
    if(!content || content.length >150){
      return;
    }

    try {
        const response=await axios.post("/api/messages",{slug,username,content})
        const data=await response.data
        console.log(data)
    } catch (error:any) {
        console.log("Error :",error)
    }
    setLoading(false)
  }

  return (
    <section className='py-24 px-[4%] md:px-0'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-center text-lg md:text-2xl'>Send Message to {username}</h1>

        <div className='mt-5'>
          <textarea
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
            loading ? <Loader/> :  <span className='flex items-center gap-3'> Send Message <SendIcon className='size-5' /></span>
          }
        
         
        </button>
      </div>
    </section>
  )
}

export default Page
