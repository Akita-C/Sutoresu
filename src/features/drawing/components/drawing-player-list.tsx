import { Label } from "@/components/ui/label";
import PlayerCard from "./player-card";
import { useDrawGameStore } from "../stores/draw-game-store";

interface PlayerCardProps {
  hostId: string | undefined;
}

export default function DrawingPlayerList({ hostId }: PlayerCardProps) {
  const { playerScores } = useDrawGameStore();

  return (
    <>
      <Label className="text-2xl font-bold p-4 mb-4">Players</Label>
      <ul className="flex flex-col gap-4">
        {playerScores.map((player) => (
          <PlayerCard
            key={player.playerId}
            name={player.playerName}
            score={player.score}
            avatar={player.playerAvatar}
            isHost={player.playerId === hostId}
          />
        ))}
      </ul>
    </>
  );
}
