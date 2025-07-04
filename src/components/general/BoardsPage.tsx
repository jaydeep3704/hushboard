"use client"
import { CreateBoardForm } from "@/components/forms/CreateBoardForm"
import { Filters } from "@/components/general/Filters"
import { Button } from "@/components/ui/button"
import {  Grid3X3, List } from "lucide-react"
import { Suspense, useState } from "react"
import { Board } from "./Board"
import { Card } from "../ui/card"

export interface BoardProps{
    id:string,
    name:string,
    description:string,
    category:string,
    mode:string,
    status:string,
    expiresAt:Date,
}


function BoardsPage({boards}:{boards:BoardProps[]}) {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

    return (
        <section className="min-h-screen max-w-7xl mx-auto">
            <div className="flex  lg:justify-between  lg:flex-row flex-col gap-4 lg:gap-0  mb-5 px-4 md:px-0">
                <div >
                    <h1 className="text-4xl font-bold">
                        My Boards
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">Create and manage your anonymous messaging spaces</p>
                </div>

                <div className="flex gap-3">
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg p-1 h-fit">
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("grid")}
                            className="h-8 px-3"
                        >
                            <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("list")}
                            className="h-8 px-3"
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                    <CreateBoardForm/>
                        

                </div>

            </div>

            {/* left and right columns */}
            <div className="grid lg:grid-cols-3  gap-6 px-4 md:px-0">
               <Suspense fallback={<Card className="col-span-1 h-[400px]"></Card>}>
                 <Filters />
               </Suspense> 

                <div className="grid lg:grid-cols-2 gap-4 lg:col-span-2 ">
                    {
                        boards.map((board:BoardProps)=>(
                            <Board id={board.id} description={board.description} category={board.category}
                            expiresAt={board.expiresAt} name={board.name}  mode={board.mode} status={board.status}
                            key={board.id}
                            />
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default BoardsPage