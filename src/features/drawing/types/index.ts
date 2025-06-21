export type CreateDrawRoomRequest = {
  roomName: string;
  config: {
    maxPlayers: number;
    maxRoundPerPlayers: number;
  };
};

export type DrawPlayerJoinRequest = {
  playerId: string;
  playerName: string;
  playerAvatar?: string;
};

export type DrawPlayer = DrawPlayerJoinRequest & {
  connectionId: string;
};

export interface DrawRoom {
  roomId: string;
  roomName: string;
  host: { hostId: string; hostName: string };
  config: { maxPlayers: number; maxRoundPerPlayers: number };
}

export interface DrawWaitingRoomMessage {
  senderId: string;
  senderName: string;
  message: string;
}

export interface DrawGameHubContract {
  server: {
    JoinRoom(roomId: string, request: DrawPlayerJoinRequest): Promise<void>;
    LeaveRoom(roomId: string, player: DrawPlayer): Promise<void>;
    SendRoomMessage(roomId: string, message: string): Promise<void>;
    KickPlayer(roomId: string, player: DrawPlayer): Promise<void>;
  };
  client: {
    JoinRoom(player: DrawPlayer): void;
    LeaveRoom(): void;
    UserJoined(player: DrawPlayer): void;
    UserLeft(player: DrawPlayer): void;
    RoomMessageReceived(senderId: string, senderName: string, message: string): void;
    RoomDeleted(): void;
  };
}

export type SignalRMethod = (...args: unknown[]) => Promise<unknown>;
export type EventHandler = (...args: unknown[]) => void;

export type DrawGameEventHandlers = {
  [K in keyof DrawGameHubContract["client"] as `on${K}`]?: DrawGameHubContract["client"][K];
};
