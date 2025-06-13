"use client"
import React, { useEffect, } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Share2 } from 'lucide-react'
import { Link } from 'lucide-react'
import { MessageSquareMore } from 'lucide-react'
import { motion } from "motion/react"
import { useAnimate, useInView } from 'motion/react'

const cardInfo = [
    {
        title: "Generate Your Link",
        description: "Create your anonymous message within one click",
        icon: <Link />
    },
    {
        title: "Share it anywhere",
        description: "Post your link on social media or share it privately",
        icon: <Share2 />
    },
    {
        title: "Receive Feedback",
        description: "Get honest, anonymous messages instantly",
        icon: <MessageSquareMore />
    }
]




const HowItWorks = () => {
    const [scope, animate] = useAnimate()
    const isInView = useInView(scope,{once:false,amount:0.5})
   
      
      
    useEffect(() => {

        const animateCards=async ()=>{
            if(isInView){
                animate(".hiw-card", { y: 0, opacity: 1 },
                    { duration: 0.5, delay: (i) => i * 0.2 ,ease:'easeInOut' })
            }
            else {
                await animate(
                  ".hiw-card",
                  { y: 100, opacity: 0 },
                  { duration: 0.4, delay: (i) => i * 0.1,ease:'easeInOut' }
                );
              }
        }
        animateCards()

    }, [isInView,animate])
    return (
        <section className='h-screen  mt-10  px-[4%] flex items-center' id='how-it-works' ref={scope}>
            <div className='max-w-5xl mx-auto'>
                <h1 className='md:text-6xl text-4xl text-center md:text-start'>How It Works?</h1>
                <div className='grid grid-cols-1 md:grid-cols-3  md:justify-evenly gap-5 md:gap-10   mt-8'>
                    {
                        cardInfo.map((card) => {
                            return (
                                <Card className='p-8 hiw-card hover:scale-105 transition-all' key={card.title}  >
                                    <CardTitle className='text-lg md:text-2xl flex justify-between items-center'  >{card.title}  <motion.span >{card.icon} </motion.span> </CardTitle>
                                    <CardDescription className='text-sm md:text-md'>{card.description}</CardDescription>
                                </Card>
                            )
                        })
                    }
                </div>

            </div>


        </section>
    )
}

export default HowItWorks
