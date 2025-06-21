"use client";

import SpringButton from "@/components/common/spring-button/spring-button";
import ShinyText from "@/components/react-bits/ShinyText/ShinyText";
import { useAuth } from "@/features/auth";
import PlayerAvatar from "@/features/drawing/components/player-avatar";
import { useDrawRoomData } from "../hooks/use-draw-queries";
import DrawRoomPageSkeleton from "../skeletons/draw-room-page.skeleton";
import { useDrawGameHub } from "../hooks/use-draw-signalr";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useDrawCacheUpdater } from "../hooks/use-draw-cache-updater";
import DrawWaitingRoomChatbox from "../components/draw-waiting-room-chatbox";
import { DrawWaitingRoomMessage } from "../types";

interface DrawRoomPageProps {
  roomId: string;
}

export default function DrawRoomPage({ roomId }: DrawRoomPageProps) {
  const { user } = useAuth();
  const [myConnectionId, setMyConnectionId] = useState<string | null>(null);
  const { players, room, isLoading } = useDrawRoomData(user?.id, roomId, myConnectionId);
  const { JoinRoom, LeaveRoom, SendRoomMessage, registerEvents, unregisterEvents, isConnected } = useDrawGameHub({
    autoConnect: true,
    onError(error) {
      toast.error(error.message);
    },
  });
  const { addPlayer, removePlayer } = useDrawCacheUpdater(roomId, user?.id);
  const [messages, setMessages] = useState<DrawWaitingRoomMessage[]>([]);

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
        setMessages((prev) => [...prev, { senderId, senderName, message }]);
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

  if (isLoading) return <DrawRoomPageSkeleton />;

  return (
    <>
      <DrawWaitingRoomChatbox
        myId={user?.id}
        messages={messages}
        className="absolute top-1/2 -translate-y-1/2 right-8"
        onSendMessage={(message) => {
          if (!user?.id || !user?.name) return;
          setMessages((prev) => [...prev, { senderId: user.id!, senderName: user.name!, message }]);
          SendRoomMessage(roomId, message);
        }}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2">
        <div className="flex justify-center items-center py-8">
          <ShinyText text={room?.roomName || "Unknown Room Name"} speed={8} className="font-bold text-4xl" />
        </div>
        <div className="flex flex-wrap justify-center gap-4 max-w-[400px] mx-auto">
          {players && players.length > 0 ? (
            players.map((player) => (
              <PlayerAvatar key={player.playerId} src={player.playerAvatar!} fallback={player.playerName} />
            ))
          ) : (
            <div className="text-center text-sm text-muted-foreground">No players in the room</div>
          )}
        </div>
        <div className="flex justify-center items-center py-8">
          <SpringButton>Start Game</SpringButton>
        </div>
      </div>
    </>
  );
}
