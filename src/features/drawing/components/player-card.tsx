import PlayerAvatar from "./player-avatar";

interface PlayerCardProps {
  name: string;
  score: number;
  isHost: boolean;
}

export default function PlayerCard({ name, score, isHost }: PlayerCardProps) {
  return (
    <li className="flex items-center gap-2 px-4 py-2rounded-lg">
      <PlayerAvatar src="https://github.com/shadcn.png" fallback={name} className="size-12" isHost={isHost} />
      <div className="flex flex-col gap-1 pl-1 pr-6">
        <span>{name}</span>
        <span>{score}</span>
      </div>
    </li>
  );
}
