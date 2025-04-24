"use client"
import React from 'react'
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
import {motion} from "motion/react"
const cardInfo = [
    {
        title: "Generate Your Link",
        description: "Create your anonymous message within one click",
        icon:<Link/>
    },
    {
        title: "Share it anywhere",
        description: "Post your link on social media or share it privately",
        icon:<Share2/>
    },
    {
        title: "Receive Feedback",
        description: "Get honest, anonymous messages instantly",
        icon:<MessageSquareMore/>
    }
]

const HowItWorks = () => {
    return (
        <section className='py-20   mt-10  px-[4%] ' id='how-it-works'>
            <div className='max-w-5xl mx-auto'>
            <h1 className='md:text-6xl text-4xl text-center md:text-start'>How It Works?</h1>
            <div className='grid grid-cols-1 md:grid-cols-3  md:justify-evenly gap-5 md:gap-10   mt-8'>
            {
                cardInfo.map((card) => {
                    return (
                        <Card className='bg-secondary-foreground p-5  md:h-[200px] ' key={card.title}  >
                            <CardTitle className='text-2xl flex justify-between items-center'  >{card.title}  <motion.span >{card.icon} </motion.span> </CardTitle>
                            <CardDescription className='text-md'>{card.description}</CardDescription>
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
