import { motion, AnimatePresence } from "motion/react"
import { Card, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";



const messages = [
  "Why does Priya sound like she’s narrating a documentary during meetings? 🙂",
  "Can someone please teach Rohan how to use 'Reply' instead of 'Reply All'? 🙃",
  "Snacks vanish faster than decisions around here. 😅",
  "Ashish deserves a raise — or at least a proper chair. 🙂",
  "If meetings burned calories, we’d all be shredded by now. 😤",
  "Neha's Google Sheets have more drama than our team chat. 😬",
  "Can we all agree to stop saying 'let’s circle back' unless we mean it? 😶",
];



interface AnimatedFeedProps{
    title:string,
    description:string
}



export function AnimatedFeed({title,description}:AnimatedFeedProps) {

    const [index, setIndex] = useState<number>(0)
    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % messages.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);




    return (
        <div className="flex flex-col gap-20 justify-center items-center min-h-screen">
            <div className="flex justify-center items-center flex-col">
                <h1 className="font-bold text-4xl mb-3">{title}</h1>
                <p className="text-lg">{description}</p>
            </div>
            <div className="h-[120px] w-[400px] relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ y: 60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -60, opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="absolute w-full"
                    >
                        <Card className="border-[1px] border-white/20">
                            <CardHeader>
                                <CardTitle className="text-center text-balance">{messages[index]}</CardTitle>
                            </CardHeader>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>

        </div>
    )
}