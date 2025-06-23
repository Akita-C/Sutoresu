import { Label } from "@/components/ui/label";
import PlayerCard from "./player-card";

export default function DrawingPlayerList() {
  return (
    <>
      <Label className="text-2xl font-bold p-4 mb-4">Players</Label>
      <ul className="flex flex-col gap-4">
        <PlayerCard name="Quang" score={10000} isHost={true} />
        <PlayerCard name="Quang" score={10000} isHost={true} />
        <PlayerCard name="Quang" score={10000} isHost={true} />
        <PlayerCard name="Quang" score={10000} isHost={true} />
      </ul>
    </>
  );
}
