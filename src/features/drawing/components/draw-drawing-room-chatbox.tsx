import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import PlayerAvatar from "./player-avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart, HeartOff, Loader2, Send } from "lucide-react";
import { MAX_HEARTS, useDrawGameStore } from "../stores/draw-game-store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/features/auth";

const MAX_MESSAGE_LENGTH = 20;
const chatSchema = z.object({
  message: z.string().min(1).max(MAX_MESSAGE_LENGTH),
});
type ChatForm = z.infer<typeof chatSchema>;

interface DrawDrawingRoomChatboxProps {
  onSendMessage: (message: string) => Promise<void>;
}

export default function DrawDrawingRoomChatbox({ onSendMessage }: DrawDrawingRoomChatboxProps) {
  const { playerHearts, playerGuesses, phase, currentDrawerId } = useDrawGameStore();
  const { user } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<ChatForm>({
    resolver: zodResolver(chatSchema),
  });

  const onSubmit = async (data: ChatForm) => {
    await onSendMessage(data.message);
    reset();
  };

  const isDisabled =
    isSubmitting ||
    playerHearts <= 0 ||
    (phase !== "drawing" && phase !== "guessing") ||
    currentDrawerId === user?.id;

  return (
    <>
      <div className="flex items-center justify-between px-3 mt-3">
        <Label className="text-2xl font-bold py-2">Chat</Label>
        <div className="flex items-center gap-2 pr-2">
          {Array.from({ length: playerHearts }).map((_, index) => (
            <Heart className="text-red-500" key={index} />
          ))}
          {Array.from({ length: MAX_HEARTS - playerHearts }).map((_, index) => (
            <HeartOff className="text-red-500" key={index} />
          ))}
        </div>
      </div>
      <div className="p-3 space-y-4">
        <ScrollArea className="h-[625px] no-scrollbar overflow-y-auto border-2 rounded-lg py-4">
          <ul className="flex flex-col gap-4">
            {playerGuesses.map((guess, index) => {
              if (guess.type === "wrong") {
                return (
                  <li key={index} className="flex items-center gap-2 px-4 py-2 rounded-lg">
                    <PlayerAvatar
                      src={guess.playerAvatar}
                      fallback={guess.playerName!}
                      className="size-10"
                    />
                    <span className="text-sm">{guess.message}</span>
                  </li>
                );
              } else {
                return (
                  <li
                    key={index}
                    className="flex items-center justify-center bg-emerald-500 py-2 rounded-lg"
                  >
                    <span>{guess.playerName} guessed correctly</span>
                  </li>
                );
              }
            })}
          </ul>
        </ScrollArea>
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2">
          <Input
            placeholder="Type a message..."
            {...register("message")}
            className="flex-1"
            disabled={isDisabled}
            maxLength={MAX_MESSAGE_LENGTH}
          />
          <Button size="sm" type="submit" className="cursor-pointer" disabled={isDisabled}>
            {isSubmitting ? (
              <Loader2 className="size-4 text-foreground animate-spin" />
            ) : (
              <Send className="size-4 text-foreground" />
            )}
          </Button>
        </form>
      </div>
    </>
  );
}
