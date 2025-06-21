import { useQueries } from "@tanstack/react-query";
import { drawService } from "../services/draw-service";

export const useDrawRoomData = (playerId: string | undefined, roomId: string | undefined) => {
  return useQueries({
    queries: [
      {
        queryKey: ["draw-room-players", playerId, roomId],
        queryFn: async () => (await drawService.getDrawRoomPlayers(playerId!, roomId!)).data,
        enabled: !!playerId && !!roomId,
      },
      {
        queryKey: ["draw-room", roomId],
        queryFn: async () => (await drawService.getDrawRoom(roomId!)).data,
        enabled: !!roomId,
      },
    ],
    combine: (results) => {
      const [playersQuery, roomQuery] = results;

      return {
        players: playersQuery.data,
        room: roomQuery.data,
        isLoading: playersQuery.isLoading || roomQuery.isLoading,
        isError: playersQuery.isError || roomQuery.isError,
        isSuccess: playersQuery.isSuccess && roomQuery.isSuccess,
      };
    },
  });
};
