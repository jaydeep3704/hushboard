"use client"

import { generateAnonName } from "@/lib/utils/anonGenerator"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

interface SocketProviderProps {
  children?: React.ReactNode
}

interface Message {
  message: string
  timeStamp: string
  anonUser: string
}

interface ISocketContext {
  sendMessage: (msg: string, roomId?: string, anonUser?: string) => any
  joinRoom: (roomId: string) => any
  messages: Message[]
  socket: Socket | undefined
}

const SocketContext = React.createContext<ISocketContext | null>(null)

export const useSocket = () => {
  const state = useContext(SocketContext)
  if (!state) throw new Error("State is undefined")
  return state
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>()
  const [messages, setMessages] = useState<Message[]>([])
  const [room, setRoom] = useState<string | null>(null)

  const sendMessage = useCallback(
    (msg: string, roomId?: string, anonUser?: string) => {
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

      if (roomId && anonUser) {
        socket.emit("event:room-message", {
          message: msg,
          timeStamp: dateString,
          roomId,
          anonUser,
        })
      } else {
        socket.emit("event:message", {
          message: msg,
          timeStamp: dateString,
        })
      }
    },
    [socket]
  )

  const joinRoom: ISocketContext["joinRoom"] = useCallback(
    (roomId: string) => {
      if (!socket) return
      if (room && room !== roomId) {
        socket.emit("leave-room", room)
      }
      socket.emit("event:join-room", { roomId })
      setRoom(roomId)
    },
    [socket, room]
  )

  const onMessageRec = useCallback((msg: string) => {
    console.log("Message received from server:", msg)
    const { message, timeStamp, anonUser } = JSON.parse(msg) as Message
    setMessages((prev) => [...prev, { message, timeStamp, anonUser }])
  }, [])

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
    <SocketContext.Provider value={{ sendMessage, joinRoom, messages, socket }}>
      {children}
    </SocketContext.Provider>
  )
}
