"use client";

import { useDrawGameStore } from "../../stores/draw-game-store";
import RoundTimer from "./round-timer";

export default function GameInfoBar() {
  const { currentRound, totalRounds } = useDrawGameStore();

  if (!currentRound || !totalRounds) {
    return null;
  }

  return (
    <div className="flex justify-between items-center p-4 bg-card rounded-lg border">
      <div className="text-sm text-muted-foreground">
        Round {currentRound} of {totalRounds}
      </div>
      <RoundTimer />
    </div>
  );
}
