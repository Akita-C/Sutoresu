import { useEffect, useState } from "react";
import { useDrawGameStore } from "../../stores/draw-game-store";
import { cn } from "@/lib/utils";

interface RoundTimerProps {
  className?: string;
}

export default function RoundTimer({ className }: RoundTimerProps) {
  const { getRemainingSeconds, phaseStartTime } = useDrawGameStore();
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  useEffect(() => {
    const updateTimer = () => {
      const remaining = getRemainingSeconds();
      setRemainingSeconds(remaining);
    };

    // Update timer immediately
    updateTimer();

    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [getRemainingSeconds, phaseStartTime]);

  if (remainingSeconds === null) return null;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeString = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  const isUrgent = remainingSeconds <= 10;

  return (
    <div
      className={cn(
        "text-2xl font-bold text-foreground",
        isUrgent && "text-red-500 animate-pulse",
        className,
      )}
    >
      {timeString}
    </div>
  );
}
