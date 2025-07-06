"use client"

import React, { useCallback, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

interface SocketProviderProps {
    children?: React.ReactNode
}

interface Message {
    message: string
    timeStamp: string
}

interface ISocketContext {
    sendMessage: (msg: string,roomId?:string) => any
    joinRoom: (roomId: string) => any
    messages: Message[],
    socket:Socket
}

const SocketContext = React.createContext<ISocketContext | null>(null)

export const useSocket = () => {
    const state = useContext(SocketContext)
    if (!state) throw new Error("State is undefined")
    return state
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }: SocketProviderProps) => {
    const [socket, setSocket] = useState<Socket>()
    const [messages, setMessages] = useState<Message[]>([])

    // ✅ Send message to server
    const sendMessage = useCallback(
    (msg: string, roomId?: string) => {
        if (!socket) return

        const date = new Date()
        const dateString = date.toLocaleString("en-US", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        })

        if (roomId) {
            // Room message
            socket.emit("event:room-message", {
                message: msg,
                timeStamp: dateString,
                roomId
            })
        } else {
            // Global message
            socket.emit("event:message", {
                message: msg,
                timeStamp: dateString
            })
        }
    },
    [socket]
)


    // ✅ Join room on server
    const joinRoom: ISocketContext["joinRoom"] = useCallback(
        (roomId: string) => {
            if (!socket) return
            console.log("Joining room:", roomId)
            socket.emit("event:join-room", { roomId })
        },
        [socket]
    )

    // ✅ Handle incoming message
    const onMessageRec = useCallback((msg: string) => {
        console.log("Message received from server:", msg)
        const { message, timeStamp } = JSON.parse(msg) as Message
        setMessages((prev) => [...prev, { message, timeStamp }])
    }, [])  // No socket dependency here!

    // ✅ Connect socket & setup listeners
    useEffect(() => {
        const _socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL!)
        setSocket(_socket)
        _socket.on("message", onMessageRec)
        
        return () => {
            _socket.disconnect()
            _socket.off("message", onMessageRec)
            setSocket(undefined)
        }
    }, [onMessageRec])

    return (
        <SocketContext.Provider value={{ sendMessage, joinRoom, messages,socket }}>
            {children}
        </SocketContext.Provider>
    )
}
