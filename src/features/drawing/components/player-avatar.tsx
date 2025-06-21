import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Crown } from "lucide-react";

interface PlayerAvatarProps {
  src: string;
  fallback: string;
  className?: string;
}

export default function PlayerAvatar({ src, fallback, className }: PlayerAvatarProps) {
  return (
    <Avatar className={cn("size-16 overflow-visible relative cursor-pointer", className)}>
      <AvatarImage src={src} className="rounded-full" />
      <AvatarFallback>{fallback}</AvatarFallback>
      <Crown className="text-yellow-400 absolute -top-1 right-0 size-6 rotate-30" />
    </Avatar>
  );
}
