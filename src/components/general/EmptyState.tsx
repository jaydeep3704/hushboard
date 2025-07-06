"use client"

import { IconDisabled } from "@tabler/icons-react"
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

export function EmptyState(){
    const router=useRouter()
    return(
        <Card className="min-h-[60vh] flex justify-center items-center p-5">
                <div className="flex justify-center flex-col items-center ">
                     <CardTitle className="text-center font-bold text-xl md:text-2xl text-balance"> No boards yet! Looks like your message space is empty.</CardTitle>
                     <CardDescription className="text-balance md:text-lg text-center mt-3">Try again removing your filters or create a new one</CardDescription>
                     <Button variant="gradient" className="w-fit rounded-md mt-4 cursor-pointer"
                     onClick={()=>router.push("/boards")}
                     >Remove All Filters</Button>
                </div>
        </Card>
    )
}