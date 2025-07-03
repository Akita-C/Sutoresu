"use client";

import { useDrawGameStore } from "../../stores/draw-game-store";
import RoundTimer from "./round-timer";

export default function GameInfoBar() {
  const { currentRound, totalRounds, phase } = useDrawGameStore();

  if (!currentRound || !totalRounds) {
    return null;
  }

  return (
    <div className="flex justify-between items-center p-4 bg-card rounded-lg border">
      <div className="text-sm text-muted-foreground">
        Round {currentRound} of {totalRounds}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground font-bold text-lg">
          {phase === "drawing" && "Drawing"}
          {phase === "guessing" && "Guessing"}
          {phase === "reveal" && "Revealing"}
        </span>
        <RoundTimer />
      </div>
    </div>
  );
}
