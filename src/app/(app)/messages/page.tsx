"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/Loader";
import { motion } from "motion/react";
import {  RefreshCw, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { User } from "@/generated/prisma";
import { twMerge } from "tailwind-merge";

type Board = {
  id: number;
  name: string;
  slug: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  isAcceptingMessages: boolean;
};

type Message = {
  id: string;
  boardId: number;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  board: Board;
};

const page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/messages");
      const data = await response.data;
      console.log(data);
      setMessages(data.messages);
    } catch (error) {
      console.log("Error :", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const onDeleteMessage = async (id: string, slug: string) => {
    try {
      const response = await axios.delete(`/api/boards/${slug}/messages/${id}`);
      const data = response.data;
      console.log(data);
      if (response.status === 200) {
        setMessages(() => messages.filter((message) => message.id !== id));
        toast.success("Message deleted successfully");
      }
    } catch (error: any) {
      console.log("Error : ", error);
      toast.error("Error while deleting message");
    }
  };

  const formatDate = (createdAt: string): string => {
    const date = new Date(createdAt);
    const now = new Date();

    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12; // Convert hour to 12-hour format
    const formattedTime = `${hour12.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${ampm}`;

    if (
      now.getFullYear() === date.getFullYear() &&
      now.getMonth() === date.getMonth() &&
      now.getDate() === date.getDate()
    ) {
      return `Today ${formattedTime}`;
    }

    if (diffDays === 1) {
      return `Yesterday ${formattedTime}`;
    }

    if (diffDays < 30) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    }

    const diffMonths =
      now.getFullYear() * 12 + now.getMonth() -
      (date.getFullYear() * 12 + date.getMonth());

    if (diffMonths < 12) {
      return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
    }

    const diffYears = now.getFullYear() - date.getFullYear();
    return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
  };

  const getBoardColor = (boardId: number) => {
    const badgeClasses = [
      "bg-green-600/20 border border-green-400 text-green-600",
      "bg-blue-600/20 border border-blue-400 text-blue-600",
      "bg-purple-600/20 border border-purple-400 text-purple-600",
      "bg-orange-600/20 border border-orange-400 text-orange-600",
      "bg-yellow-600/20 border border-yellow-400 text-yellow-600",
    ];

    return badgeClasses[boardId % badgeClasses.length];
  };

  return (
    <section className="py-16 md:py-24 px-[4%] md:px-0">
      <h1 className="text-center mb-5 text-xl md:text-3xl">All Messages</h1>
      <div className="max-w-5xl mx-auto flex justify-center">
          <button
          className="text-sm cursor-pointer flex gap-2 items-center px-5 py-2 bg-secondary-foreground rounded-lg border border-white/15"
          onClick={fetchMessages}
          >Refresh <RefreshCw className={`size-3 md:size-4 ${loading && 'animate-spin'}`}/></button>
      </div>
      <div className="w-full max-w-5xl mx-auto">
        {loading ? (
          <Loader />
        ) : messages.length > 0 ? (
          <div className="mt-5 flex flex-col gap-5">
            {messages.map((message: Message, index) => {
              const { board, boardId, content, createdAt } = message;
              const { name, slug } = board;
              const boardClass = getBoardColor(boardId);
              return (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 100,
                    backdropFilter: "blur(20px)",
                  }}
                  animate={{
                    opacity: 100,
                    y: 0,
                    backdropFilter: "blur(0px)",
                  }}
                  transition={{
                    duration: 0.4,
                    delay: 0.04 * index,
                    ease: "easeIn",
                  }}
                  className="w-full py-3 px-5 rounded-lg bg-secondary-foreground flex justify-between items-center"
                  key={message.id}
                >
                  <div className="w-full flex flex-col gap-2">
                    <Badge
                      className={twMerge(boardClass, "text-xs")}
                    >
                      {name}
                    </Badge>

                    <p className="md:text-md text-sm">{message.content}</p>
                    <p className="text-sm text-white/50">{formatDate(createdAt)}</p>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger className="absolute right-4 top-3">
                      <Trash2 className="cursor-pointer md:size-5 size-4" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your message.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-accent hover:bg-accent/70"
                          onClick={() => onDeleteMessage(message.id, slug)}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto text-center md:text-xl text-lg">
            No Messages Yet -
          </div>
        )}
      </div>
    </section>
  );
};

export default page;
