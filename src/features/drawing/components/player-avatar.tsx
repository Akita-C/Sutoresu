import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown } from "lucide-react";

interface PlayerAvatarProps {
  src: string;
  fallback: string;
}

export default function PlayerAvatar({ src, fallback }: PlayerAvatarProps) {
  return (
    <Avatar className="size-16 overflow-visible relative cursor-pointer">
      <AvatarImage src={src} className="rounded-full" />
      <AvatarFallback>{fallback}</AvatarFallback>
      <Crown className="text-yellow-400 absolute -top-1 right-0 size-6 rotate-30" />
    </Avatar>
  );
}
