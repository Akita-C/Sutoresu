import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Crown } from "lucide-react";

interface PlayerAvatarProps {
  src: string | undefined;
  fallback: string;
  className?: string;
  isHost?: boolean;
}

export default function PlayerAvatar({ src, fallback, className, isHost }: PlayerAvatarProps) {
  return (
    <Avatar className={cn("size-16 overflow-visible relative cursor-pointer", className)}>
      <AvatarImage src={src} className="rounded-full" />
      <AvatarFallback className="truncate">{fallback}</AvatarFallback>
      {isHost && <Crown className="text-yellow-400 absolute -top-1 right-0 size-6 rotate-30" />}
    </Avatar>
  );
}
