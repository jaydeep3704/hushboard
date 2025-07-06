"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useSocket } from "@/context/SocketProvider"
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog"
import { Copy, MessageCircle, SendIcon, ShareIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { toast } from "sonner"

interface Message {
    message: string
    timeStamp: string
}

const MessageItem = ({ message, timeStamp }: Message) => {
    return (
        <div className="flex flex-col gap-1 p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
            <p className="break-words text-base">{message}</p>
            <span className="text-xs text-muted-foreground self-end">{timeStamp}</span>
        </div>
    )
}

export default function AnonymousChatPage() {
    const { sendMessage ,joinRoom,socket} = useSocket()
    const [message, setMessage] = useState("")
    const[messages,setMessages]=useState<Message[]>([])
    const { id: boardId } = useParams()
    const [open, setOpen] = useState<boolean>(false)

    const chatContainerRef = useRef<HTMLDivElement | null>(null)
    
    useEffect(()=>{
        joinRoom(boardId.toString())
        if(socket){
            socket.on('recieve-room-message',({message,timeStamp})=>{
                console.log("Recieved message",message)
                setMessages((prev)=>[...prev,{message,timeStamp}])
            })
        }
    },[joinRoom])

    useEffect(() => {
        const container = chatContainerRef.current
        if (container) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: "smooth",
            })
        }
    }, [messages])

    return (
        <div className="max-w-4xl mx-auto min-h-screen px-4 py-8 flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="flex items-center gap-2 lg:gap-3 text-xl lg:text-3xl font-bold text-center w-fit">
                    <div className="p-2 bg-purple-600 rounded-lg">
                        <MessageCircle className="size-4 lg:size-6 text-white" />
                    </div>
                    Chat Room
                </h1>
                
            </div>

            <Card className="flex flex-col h-[80vh] bg-card/60 backdrop-blur-xl shadow-lg border border-primary/30 rounded-2xl overflow-hidden">
                {/* Scrollable chat area */}
                <div className="flex-1 overflow-hidden">
                    <div
                        className="h-full overflow-y-auto p-4 space-y-4 no-scrollbar"
                        ref={chatContainerRef}
                    >
                        {messages.length === 0 ? (
                            <div className="text-center text-muted-foreground italic">
                                No messages yet.
                            </div>
                        ) : (
                            messages.map((msg, index) => (
                                <MessageItem key={index} message={msg.message} timeStamp={msg.timeStamp} />
                            ))
                        )}
                    </div>
                </div>

                {/* Message input */}
                <div className="border-t border-border p-4">
                    <div className="flex items-center gap-3">
                        <Input
                            className="flex-1"
                            placeholder="Type your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button
                            onClick={() => {
                                if (message.trim()) {
                                    sendMessage(message,boardId as string)
                                    setMessage("")
                                }
                            }}
                            className="flex gap-2 items-center px-4 bg-purple-600 text-white hover:bg-purple-600/80"
                        >
                            <SendIcon className="w-4 h-4" />
                            Send
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
