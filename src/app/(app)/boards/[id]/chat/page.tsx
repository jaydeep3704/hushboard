"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSocket } from "@/context/SocketProvider";
import { SendIcon } from "lucide-react";
import { useState } from "react";

export default function ChatPage() {
  const { sendMessage ,messages} = useSocket();
  const [message, setMessage] = useState("");

  return (
    <div className="max-w-4xl mx-auto min-h-screen px-4 py-8 flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-center">Chat Room</h1>

      <Card className="flex flex-col h-[80vh] bg-card/60 backdrop-blur-xl shadow-lg border border-primary/30 rounded-2xl overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
           {
            messages.length==0 ?
            (
           <div className="text-center text-muted-foreground italic">
            No messages yet.
          </div>
            ):
            (
                messages.map((message,index)=>(
                    <div key={index}>{message}</div>
                ))
            )
           }
          
        </div>

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
                  sendMessage(message);
                  setMessage("");
                }
              }}
              className="flex gap-2 items-center px-4"
            >
              <SendIcon className="w-4 h-4" />
              Send
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
