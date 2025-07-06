"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { BoardProps } from "./BoardsPage";
import { LockIcon, MessageCircle, UserIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { gt } from "@/lib/utils/GlobalTimer";
import { useRouter } from "next/navigation";

const categoryColors = {
    technology: "bg-gradient-to-r from-indigo-500 to-purple-500",
    personal: "bg-gradient-to-r from-fuchsia-500 to-pink-500",
    education: "bg-gradient-to-r from-violet-500 to-indigo-500",
    entertainment: "bg-gradient-to-r from-purple-500 to-fuchsia-500",
    support: "bg-gradient-to-r from-rose-500 to-pink-500",
    random: "bg-gradient-to-r from-cyan-500 to-violet-500",
};

interface BoardComponentProps extends BoardProps {
    viewMode: string;
}

export function Board({
    id,
    name,
    description,
    category,
    mode,
    status,
    expiresAt,
    viewMode,
}: BoardComponentProps) {
    const router=useRouter()
    return (
        <Card className="hover:shadow-xl transition h-auto cursor-pointer" onClick={()=>router.push(`boards/${id}/${mode}`)}>
            <CardHeader>
                <div className="flex gap-2 items-center">
                    <div
                        className={cn("p-3 shadow-md rounded-lg w-fit text-white", categoryColors[category])}
                    >
                        {mode === "private" ? <LockIcon /> : <MessageCircle />}
                    </div>
                    <div className="flex flex-col gap-1">
                        <Badge
                            className={cn(
                                "capitalize px-4 rounded-full text-white ",
                                status === "active" ? "bg-green-600" : "bg-foreground"
                            )}
                        >
                            {status}
                        </Badge>
                        <Badge variant="outline" className="px-3 rounded-full bg-primary text-white">
                            {mode === "private" ? "Private" : "Group Chat"}
                        </Badge>
                    </div>
                </div>
                <div>
                    <CardTitle className="text-ellipsis text-lg mt-3">{name}</CardTitle>
                    <CardDescription className="line-clamp-2">{description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-muted-foreground flex justify-between items-center text-sm">
                    <div className="flex gap-2 items-center">
                        <UserIcon className="size-4" /> 0 active
                    </div>
                    <div className="flex gap-2 items-center">
                        <MessageCircle className="size-4" /> 0 messages
                    </div>
                </div>
                
            </CardContent>
        </Card>
    );
}
