import { useQueryClient } from "@tanstack/react-query";
import { DrawPlayer, DrawRoom } from "../types";

export const useDrawCacheUpdater = (roomId: string, playerId: string | undefined) => {
  const queryClient = useQueryClient();

  const updatePlayersCache = (updater: (players: DrawPlayer[]) => DrawPlayer[]) => {
    queryClient.setQueryData<DrawPlayer[]>(["draw-room-players", playerId, roomId], (oldData) => {
      if (!oldData) return oldData;
      return updater(oldData);
    });
  };

  const updateRoomCache = (updater: (room: DrawRoom) => DrawRoom) => {
    queryClient.setQueryData<DrawRoom>(["draw-room", roomId], (oldData) => {
      if (!oldData) return oldData;
      return updater(oldData);
    });
  };

  const addPlayer = (newPlayer: DrawPlayer) => {
    updatePlayersCache((players) => {
      const player = players.find((p) => p.playerId === newPlayer.playerId);
      if (player && player.connectionId === null) {
        return players.map((old) => (old.playerId === newPlayer.playerId ? newPlayer : old));
      }

      return [...players, newPlayer];
    });
  };

  const removePlayer = (playerIdToRemove: string) => {
    updatePlayersCache((players) => players.filter((p) => p.playerId !== playerIdToRemove));
  };

  const invalidatePlayersCache = () => {
    queryClient.invalidateQueries({
      queryKey: ["draw-room-players", playerId, roomId],
    });
  };

  const invalidateRoomCache = () => {
    queryClient.invalidateQueries({
      queryKey: ["draw-room", roomId],
    });
  };

  return {
    addPlayer,
    removePlayer,
    updateRoomCache,
    invalidatePlayersCache,
    invalidateRoomCache,
  };
};
