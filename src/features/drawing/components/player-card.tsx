import { cn } from "@/lib/utils";
import PlayerAvatar from "./player-avatar";

interface PlayerCardProps {
  name: string;
  score: number;
  isHost: boolean;
  avatar: string | undefined;
  isCurrentDrawer: boolean;
}

export default function PlayerCard({
  name,
  score,
  isHost,
  avatar,
  isCurrentDrawer,
}: PlayerCardProps) {
  return (
    <li
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg",
        isCurrentDrawer && "bg-[#7692ff]/60",
      )}
    >
      <PlayerAvatar src={avatar} fallback={name} className="size-12" isHost={isHost} />
      <div className="flex flex-col gap-1 pl-1 pr-6">
        <span className="truncate font-bold">{name}</span>
        <span>{score}</span>
      </div>
    </li>
  );
}
