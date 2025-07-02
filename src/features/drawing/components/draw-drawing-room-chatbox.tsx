import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import PlayerAvatar from "./player-avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function DrawDrawingRoomChatbox() {
  return (
    <>
      <Label className="text-2xl font-bold p-4 mb-2">Chat</Label>
      <div className="p-3 space-y-4">
        <ScrollArea className="h-[625px] no-scrollbar overflow-y-auto border-gray-700 border-2 rounded-lg py-4">
          <ul className="flex flex-col gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <li key={index} className="flex items-center gap-2 px-4 py-2rounded-lg">
                <PlayerAvatar src="https://github.com/shadcn.png" fallback="John Doe" className="size-10" />
                <span className="text-sm">Buffalo</span>
              </li>
            ))}
          </ul>
        </ScrollArea>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type a message..."
            // value={message}
            // onChange={(e) => setMessage(e.target.value)}
            // onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button size="sm" onClick={() => {}} className="cursor-pointer">
            <Send className="size-4 text-foreground" />
          </Button>
        </div>
      </div>
    </>
  );
}
