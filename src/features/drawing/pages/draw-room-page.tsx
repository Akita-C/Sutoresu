"use client";

import { useAuth } from "@/features/auth";
import PlayerAvatar from "@/features/drawing/components/player-avatar";
import { useDrawRoomData } from "../hooks/use-draw-queries";
import DrawRoomPageSkeleton from "../skeletons/draw-room-page.skeleton";
import { useDrawGameHub } from "../hooks/use-draw-signalr";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { useDrawCacheUpdater } from "../hooks/use-draw-cache-updater";
import DrawWaitingRoomChatbox from "../components/draw-waiting-room-chatbox";
import { useDrawGameStore } from "../stores/draw-game-store";
import { DrawingCanvas, DrawingCanvasRef } from "../components/canvas/drawing-canvas";
import { DrawingToolbar } from "../components/canvas/drawing-toolbar";
import DrawDrawingRoomChatbox from "../components/draw-drawing-room-chatbox";
import GuessWord from "../components/guess-word";
import DrawingPlayerList from "../components/drawing-player-list";
import GameInfoBar from "../components/timer/game-info-bar";
import FinishedChart from "../components/charts/finished-chart";
import { useRouter } from "next/navigation";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawRoomPageProps {
  roomId: string;
}

export default function DrawRoomPage({ roomId }: DrawRoomPageProps) {
  const { user } = useAuth();
  const [myConnectionId, setMyConnectionId] = useState<string | null>(null);
  const canvasRef = useRef<DrawingCanvasRef>(null);
  const router = useRouter();

  const { players, room, isLoading } = useDrawRoomData(user?.id, roomId, myConnectionId);
  const {
    JoinRoom,
    LeaveRoom,
    SendRoomMessage,
    StartRound,
    SendDrawAction,
    SendGuessMessage,
    RequestRematch,
    registerEvents,
    unregisterEvents,
    isConnected,
  } = useDrawGameHub({
    autoConnect: true,
    onError(error) {
      toast.error(error.message);
    },
  });
  const { addPlayer, removePlayer, invalidateRoomCache, invalidatePlayersCache } =
    useDrawCacheUpdater(roomId, user?.id);
  const {
    isCreatingRoom,
    setIsCreatingRoom,
    phase,
    playerHearts,
    waitingRoomMessages,
    currentDrawerId,
    setWaitingRoomMessages,
    startRound,
    changePhase,
    endGame,
    handleGuessMessage,
    setPlayerScores,
    setCurrentWord,
    reset,
  } = useDrawGameStore();

  useEffect(() => {
    if (!isConnected) return;

    registerEvents({
      onNotifyAccessDenied() {
        toast.error("You are not allowed to join this room");
      },
      onJoinRoom(drawPlayer) {
        setMyConnectionId(drawPlayer.connectionId);
        addPlayer(drawPlayer);
      },
      onLeaveRoom() {
        setMyConnectionId(null);
      },
      onUserJoined(drawPlayer) {
        addPlayer(drawPlayer);
        toast.success(`${drawPlayer.playerName} joined the room`);
      },
      onUserLeft(drawPlayer) {
        removePlayer(drawPlayer.playerId);
        toast.success(`${drawPlayer.playerName} left the room`);
      },
      onRoomMessageReceived(senderId, senderName, message) {
        setWaitingRoomMessages({ senderId, senderName, message });
      },
      onDrawActionReceived(action) {
        canvasRef.current?.applyExternalAction(action);
      },
      onRoundStarted(roundEvent) {
        startRound(roundEvent);
        setIsCreatingRoom(false);
      },
      onEndedGame() {
        endGame();
      },
      onPhaseChanged(phaseEvent) {
        changePhase(phaseEvent);
      },
      onWordToDraw(wordToDraw) {
        setCurrentWord(wordToDraw);
      },
      onWordRevealed(wordRevealedEvent) {
        setCurrentWord(wordRevealedEvent.revealedWord);
      },
      onGuessMessageWrongReceived(playerId, message) {
        handleGuessMessage({ playerId, type: "wrong", message });
      },
      onGuessMessageCorrectReceived(playerId, newScore) {
        handleGuessMessage({ playerId, type: "correct", newScore });
      },
      onRematchRoomCreated(roomId) {
        reset();
        invalidateRoomCache();
        invalidatePlayersCache();
        router.push(`/draw/room/${roomId}`);
      },
    });
  }, [isConnected]);

  useEffect(() => {
    if (!isConnected || !user || !roomId) return;
    JoinRoom(roomId, {
      playerId: user.id!,
      playerName: user.name!,
      playerAvatar: user.avatarUrl!,
    });
    return () => {
      LeaveRoom(roomId, {
        connectionId: myConnectionId!,
        playerId: user.id!,
        playerName: user.name!,
        playerAvatar: user.avatarUrl!,
      });
    };
  }, [isConnected, user, roomId]);

  useEffect(() => {
    return () => {
      unregisterEvents();
    };
  }, []);

  useEffect(() => {
    setPlayerScores(
      players?.map((player) => ({
        playerId: player.playerId,
        playerName: player.playerName,
        playerAvatar: player.playerAvatar,
        score: 0,
      })) ?? [],
    );
  }, [players]);

  if (isLoading) return <DrawRoomPageSkeleton />;

  return (
    <>
      {phase === "waiting" && (
        <>
          <DrawWaitingRoomChatbox
            myId={user?.id}
            messages={waitingRoomMessages}
            className="absolute top-1/2 -translate-y-1/2 right-8"
            onSendMessage={(message) => {
              if (!user?.id || !user?.name) return;
              setWaitingRoomMessages({ senderId: user.id!, senderName: user.name!, message });
              SendRoomMessage(roomId, message);
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-wrap justify-center gap-4 max-w-[400px] mx-auto">
              {players && players.length > 0 ? (
                players.map((player) => (
                  <PlayerAvatar
                    key={player.playerId}
                    src={player.playerAvatar!}
                    fallback={player.playerName}
                  />
                ))
              ) : (
                <div className="text-center text-sm text-muted-foreground">
                  No players in the room
                </div>
              )}
            </div>
            <div className="flex justify-center items-center py-8">
              <InteractiveHoverButton
                disabled={isCreatingRoom || players?.length === 1 || room?.host.hostId !== user?.id}
                className={cn(
                  isCreatingRoom || players?.length === 1 || room?.host.hostId !== user?.id
                    ? "opacity-50 cursor-not-allowed"
                    : "",
                )}
                onClick={async () => {
                  setIsCreatingRoom(true);
                  await StartRound(roomId);
                }}
              >
                {isCreatingRoom ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <p>Starting Game...</p>
                  </div>
                ) : (
                  "Start Game"
                )}
              </InteractiveHoverButton>
            </div>
          </div>
          <div className="absolute top-2 right-2">
            <div className="flex gap-2 items-center">
              <p className="text-sm text-muted-foreground">Room Name:</p>
              <TypingAnimation className="text-sm">
                {room?.roomName || "Unknown Room Name"}
              </TypingAnimation>
            </div>
            <div className="flex gap-2 items-center">
              <p className="text-sm text-muted-foreground">Room ID:</p>
              <TypingAnimation className="text-sm">{roomId}</TypingAnimation>
            </div>
          </div>
        </>
      )}

      {(phase === "drawing" || phase === "guessing" || phase === "reveal") && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex gap-4">
            <aside className="bg-card/40 rounded-lg w-min-[100px]">
              <DrawingPlayerList hostId={room?.host.hostId} />
            </aside>
            <main className="w-[800px] space-y-2">
              <GameInfoBar />
              <DrawingToolbar
                onActionEmit={(action) => {
                  if (!isConnected || !roomId || !myConnectionId) return;
                  SendDrawAction(roomId, action);
                }}
              />
              <DrawingCanvas
                ref={canvasRef}
                onActionEmit={(action) => {
                  if (!isConnected || !roomId || !myConnectionId) return;
                  SendDrawAction(roomId, action);
                }}
              />
              <GuessWord />
            </main>
            <aside className="bg-card/40 rounded-lg w-[300px]">
              <DrawDrawingRoomChatbox
                onSendMessage={async (message) => {
                  if (playerHearts <= 0 || currentDrawerId === user?.id) return Promise.resolve();
                  return await SendGuessMessage(roomId, message);
                }}
              />
            </aside>
          </div>
        </div>
      )}

      {phase === "finished" && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <FinishedChart
            roomId={roomId}
            requestRematch={RequestRematch}
            isHost={room?.host.hostId === user?.id}
          />
        </div>
      )}
    </>
  );
}
