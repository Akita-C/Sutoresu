import ShinyText from "@/components/react-bits/ShinyText/ShinyText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, DoorOpen, Loader2, Medal, RotateCcw, Star, Trophy, Users } from "lucide-react";
import PlayerAvatar from "../player-avatar";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Cell } from "recharts";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { useDrawGameStore } from "../../stores/draw-game-store";
import { useRouter } from "next/navigation";
import { CreateDrawRoomRequest } from "../../types";
import { toast } from "sonner";
import RematchConfigDialog from "../dialogs/rematch-config-dialog";
import { cn } from "@/lib/utils";

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--chart-1))",
  },
};

const getBarColor = (rank: number) => {
  switch (rank) {
    case 1:
      return "#fbbf24"; // Gold
    case 2:
      return "#9ca3af"; // Silver
    case 3:
      return "#d97706"; // Bronze
    default:
      return "hsl(var(--chart-1))";
  }
};

const getRankBadgeProps = (rank: number) => {
  switch (rank) {
    case 1:
      return {
        className: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-0 shadow-lg",
        icon: <Crown className="w-3 h-3" />,
        label: "1st",
      };
    case 2:
      return {
        className: "bg-gradient-to-r from-gray-300 to-gray-500 text-white border-0 shadow-lg",
        icon: <Medal className="w-3 h-3" />,
        label: "2nd",
      };
    case 3:
      return {
        className: "bg-gradient-to-r from-amber-500 to-amber-700 text-white border-0 shadow-lg",
        icon: <Star className="w-3 h-3" />,
        label: "3rd",
      };
    default:
      return {
        className: "bg-gradient-to-r from-slate-500 to-slate-700 text-white border-0",
        icon: null,
        label: `${rank}th`,
      };
  }
};

interface FinishedChartProps {
  roomId: string;
  requestRematch: (
    roomId: string,
    theme?: string,
    newConfig?: CreateDrawRoomRequest["config"],
  ) => Promise<void>;
  isHost: boolean;
}

export default function FinishedChart({ roomId, requestRematch, isHost }: FinishedChartProps) {
  const { playerScores } = useDrawGameStore();
  const router = useRouter();
  const [isRematchDialogOpen, setIsRematchDialogOpen] = useState(false);
  const [isRequestingRematch, setIsRequestingRematch] = useState(false);

  const sortedPlayerScores = [...playerScores].sort((a, b) => b.score - a.score);
  const top3Players = sortedPlayerScores.slice(0, 3);

  const chartData = top3Players.map((player, index) => ({
    name:
      player.playerName.length > 10 ? player.playerName.slice(0, 10) + "..." : player.playerName,
    score: player.score,
    rank: index + 1,
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 400,
        spread: 100,
        origin: { x: 0, y: 0.8 },
        angle: 45,
        startVelocity: 80,
      });

      confetti({
        particleCount: 400,
        spread: 100,
        origin: { x: 1, y: 0.8 },
        angle: 135,
        startVelocity: 80,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handlePlayAgain = async () => {
    if (!roomId) {
      toast.error("Room ID not available");
      return;
    }

    try {
      setIsRequestingRematch(true);
      await requestRematch(roomId, undefined, undefined);
      toast.success("Rematch requested successfully!");
    } catch (error) {
      toast.error("Failed to request rematch");
      console.error("Rematch error:", error);
    } finally {
      setIsRequestingRematch(false);
    }
  };

  const handleRematchWithConfig = async (
    theme?: string,
    newConfig?: CreateDrawRoomRequest["config"],
  ) => {
    if (!roomId) {
      toast.error("Room ID not available");
      return;
    }

    try {
      setIsRequestingRematch(true);
      await requestRematch(roomId, theme, newConfig);
      toast.success("Rematch with new config requested successfully!");
      setIsRematchDialogOpen(false);
    } catch (error) {
      toast.error("Failed to request rematch with new config");
      console.error("Rematch with config error:", error);
    } finally {
      setIsRequestingRematch(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500 animate-pulse" />
            <ShinyText
              text="Game Finished!"
              speed={6}
              className="font-bold text-3xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent"
            />
            <Trophy className="w-8 h-8 text-yellow-500 animate-pulse" />
          </div>
          <p className="text-muted-foreground text-lg font-medium">
            Congratulations to all players! 🎉
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md border-2 border-border/50 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Top 3 Players
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Top 3 Players Chart */}
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ left: -25 }} maxBarSize={80}>
                    <XAxis
                      dataKey="name"
                      className="text-sm fill-muted-foreground"
                      tick={{ fontSize: 16 }}
                    />
                    <YAxis className="text-sm fill-muted-foreground" tick={{ fontSize: 12 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="score"
                      radius={[6, 6, 0, 0]}
                      stroke="rgba(255, 255, 255, 0.3)"
                      strokeWidth={2}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getBarColor(entry.rank)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* List of players */}
          <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md border-2 border-border/50 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-blue-500" />
                Final Rankings
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                {sortedPlayerScores.map((player, index) => {
                  const rank = index + 1;
                  const { className, icon, label } = getRankBadgeProps(rank);

                  return (
                    <div
                      key={player.playerId}
                      className={`flex items-center justify-between p-2.5 rounded-lg transition-all duration-200 hover:scale-[1.01] ${
                        rank <= 3
                          ? "bg-gradient-to-r from-muted/80 to-muted/40 border-2 border-border/50 shadow-md"
                          : "bg-gradient-to-r from-background/80 to-background/40 border border-border/30 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Badge className={className} variant="secondary">
                          {icon}
                          {label}
                        </Badge>
                        <PlayerAvatar
                          src={player.playerAvatar}
                          fallback={player.playerName}
                          className="w-9 h-9 border-2 border-border/30 shadow-sm"
                        />
                        <div>
                          <p className="font-semibold text-sm">{player.playerName}</p>
                          {rank <= 3 && (
                            <p className="text-xs text-muted-foreground font-medium">
                              {rank === 1
                                ? "🥇 Champion"
                                : rank === 2
                                  ? "🥈 Runner-up"
                                  : "🥉 Third place"}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-foreground">{player.score}</p>
                        <p className="text-xs text-muted-foreground font-medium">points</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 pt-4">
          <Button
            variant="outline"
            size="lg"
            className={cn(
              "gap-2 px-6 py-4 text-base font-semibold border-2 hover:scale-105 transition-all duration-200 shadow-md cursor-pointer",
              isRequestingRematch || !roomId || !isHost ? "opacity-50 cursor-not-allowed" : "",
            )}
            onClick={handlePlayAgain}
            disabled={isRequestingRematch || !roomId || !isHost}
          >
            {isRequestingRematch ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RotateCcw className="size-4" />
            )}
            Play Again
          </Button>
          <Button
            variant="outline"
            size="lg"
            className={cn(
              "gap-2 px-6 py-4 text-base font-semibold border-2 hover:scale-105 transition-all duration-200 shadow-md cursor-pointer",
              isRequestingRematch || !roomId || !isHost ? "opacity-50 cursor-not-allowed" : "",
            )}
            onClick={() => setIsRematchDialogOpen(true)}
            disabled={isRequestingRematch || !roomId || !isHost}
          >
            <RotateCcw className="size-4" />
            Play Again With Different Config
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2 px-6 py-4 text-base font-semibold border-2 hover:scale-105 transition-all duration-200 shadow-md cursor-pointer"
            onClick={() => {
              router.push("/draw/create");
            }}
          >
            <DoorOpen className="size-4" />
            Return to create room
          </Button>
        </div>
      </div>
      <RematchConfigDialog
        open={isRematchDialogOpen}
        onOpenChange={setIsRematchDialogOpen}
        onSubmit={handleRematchWithConfig}
        isLoading={isRequestingRematch}
      />
    </div>
  );
}
