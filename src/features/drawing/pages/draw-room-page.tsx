"use client";

import SpringButton from "@/components/common/spring-button/spring-button";
import ShinyText from "@/components/react-bits/ShinyText/ShinyText";
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

interface DrawRoomPageProps {
  roomId: string;
}

export default function DrawRoomPage({ roomId }: DrawRoomPageProps) {
  const { user } = useAuth();
  const [myConnectionId, setMyConnectionId] = useState<string | null>(null);
  const canvasRef = useRef<DrawingCanvasRef>(null);

  const { players, room, isLoading } = useDrawRoomData(user?.id, roomId, myConnectionId);
  const {
    JoinRoom,
    LeaveRoom,
    SendRoomMessage,
    StartRound,
    SendDrawAction,
    // SendLiveDrawAction,
    SendGuessMessage,
    registerEvents,
    unregisterEvents,
    isConnected,
  } = useDrawGameHub({
    autoConnect: true,
    onError(error) {
      toast.error(error.message);
    },
  });
  const { addPlayer, removePlayer } = useDrawCacheUpdater(roomId, user?.id);
  const {
    phase,
    playerHearts,
    waitingRoomMessages,
    setWaitingRoomMessages,
    startRound,
    changePhase,
    endGame,
    handleGuessMessage,
    setPlayerScores,
  } = useDrawGameStore();

  useEffect(() => {
    if (!isConnected) return;

    registerEvents({
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
      // onLiveDrawActionReceived(action) {
      // canvasRef.current?.applyExternalAction(action);
      // },
      onRoundStarted(roundEvent) {
        startRound(roundEvent);
      },
      onEndedGame() {
        endGame();
      },
      onPhaseChanged(phaseEvent) {
        changePhase(phaseEvent);
      },
      onGuessMessageWrongReceived(playerId, message) {
        handleGuessMessage({ playerId, type: "wrong", message });
      },
      onGuessMessageCorrectReceived(playerId, newScore) {
        handleGuessMessage({ playerId, type: "correct", newScore });
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
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2">
            <div className="flex justify-center items-center py-8">
              <ShinyText
                text={room?.roomName || "Unknown Room Name"}
                speed={8}
                className="font-bold text-4xl"
              />
            </div>
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
              <SpringButton
                onClick={async () => {
                  await StartRound(roomId);
                }}
              >
                Start Game
              </SpringButton>
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
                // onLiveActionEmit={(action) => {
                //   if (!isConnected || !roomId || !myConnectionId) return;
                //   SendLiveDrawAction(roomId, action);
                // }}
              />
              <GuessWord />
            </main>
            <aside className="bg-card/40 rounded-lg w-[300px]">
              <DrawDrawingRoomChatbox
                onSendMessage={async (message) => {
                  if (playerHearts <= 0) return Promise.resolve();
                  return await SendGuessMessage(roomId, message);
                }}
              />
            </aside>
          </div>
        </div>
      )}
    </>
  );
}
