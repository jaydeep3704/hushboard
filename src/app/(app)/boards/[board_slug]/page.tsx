"use client"

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { CopyIcon } from 'lucide-react'
import { useSession } from '@clerk/nextjs'
import axios from "axios"
import Loader from '@/components/Loader'

const Page = () => {
  const params = useParams()
  const board_slug=params.board_slug as string
  const { session } = useSession()
  const username = session?.user.username
  const [boardInfo, setBoardInfo] = useState<any>(null)
  const [loading,setLoading]=useState(false)
  const baseURL = "http://localhost:3000"

  useEffect(() => {
   setLoading(true)
    if (board_slug) {
      const fetchBoardInfo = async () => {
        try {
          const response = await axios.get(`/api/boards/${board_slug}/messages`)
          const data = await response.data
          console.log(data)
          setBoardInfo(data)
        } catch (error) {
          console.error("Error fetching board info:", error)
        }
      }

      fetchBoardInfo()
    }
    setLoading(false)
  }, [board_slug])  

  return (
    <section className='py-24'>
      <h1 className='text-center text-3xl'>
        {board_slug ? board_slug.split("-").join(" ") : "Board not found"}
      </h1>
      <div className='max-w-4xl mx-auto'>
        <div className='flex items-center justify-between px-5 rounded-full my-10 bg-secondary-foreground py-2'>
          <input
            type="text"
            className='outline-none pr-5 w-full'
            disabled
            value={`${baseURL}/${username}/${board_slug || ""}`}
          />
          <CopyIcon className='size-5 cursor-pointer' />
        </div>
        <div>
           {loading ? <BoardLoader/> : (<></>) }
        </div>
      </div>
    </section>
  )
}

export default Page

const BoardLoader = () => {
  return (
    <div className='w-screen h-screen flex justify-center items-center flex-col gap-5'>
      <h3 className='text-xl md:text-3xl text-white/50 text-center'>"Just a sec... We're grabbing your board messages!"</h3>
      <Loader />
    </div>
  )
}
