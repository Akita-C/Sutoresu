import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import PlayerAvatar from "./player-avatar";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DrawWaitingRoomMessage } from "../types";
import { useState } from "react";

interface DrawWaitingRoomChatboxProps {
  myId: string | undefined;
  messages: DrawWaitingRoomMessage[];
  onSendMessage: (message: string) => void;
  className?: string;
}

export default function DrawWaitingRoomChatbox({
  myId,
  messages,
  onSendMessage,
  className,
}: DrawWaitingRoomChatboxProps) {
  const [message, setMessage] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    onSendMessage(message);
    setMessage("");
  };

  return (
    <Card className={cn("w-90 bg-background/30", className)}>
      <CardHeader>
        <CardTitle className="text-lg">Waiting Room Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[400px] overflow-y-auto no-scrollbar">
          <div className="space-y-4 pb-4">
            {messages.map((message, index) => (
              <div
                className={cn("flex items-center gap-3", message.senderId === myId ? "flex-row-reverse" : "flex-row")}
                key={index}
              >
                <PlayerAvatar src={"temp"} fallback="temp" className="size-14" />
                <div
                  className={cn(
                    "flex flex-col space-y-1 max-w-[70%]",
                    message.senderId === myId ? "items-end" : "items-start",
                  )}
                >
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{message.senderName}</span>
                  </div>
                  <div
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm",
                      message.senderId === myId ? "bg-primary text-foreground" : "bg-muted",
                    )}
                  >
                    {message.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <Separator />
        <div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button size="sm" onClick={() => {}} className="cursor-pointer">
              <Send className="size-4 text-foreground" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
