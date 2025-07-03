import { DrawGameState } from "../stores/draw-game-store";
import { DrawAction } from "./draw-action";

export type CreateDrawRoomRequest = {
  roomName: string;
  config: {
    maxPlayers: number;
    maxRoundPerPlayers: number;
    drawingDurationSeconds: number;
    guessingDurationSeconds: number;
    revealDurationSeconds: number;
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
  config: {
    maxPlayers: number;
    maxRoundPerPlayers: number;
    drawingDurationSeconds: number;
    guessingDurationSeconds: number;
    revealDurationSeconds: number;
  };
}

export interface DrawWaitingRoomMessage {
  senderId: string;
  senderName: string;
  message: string;
}

export interface RoundStartedEvent {
  roomId: string;
  roundNumber: number;
  totalRounds: number;
  durationSeconds: number;
  startTime: string;
}

export interface RoundEndedEvent {
  roomId: string;
  roundNumber: number;
  isGameFinished: boolean;
}

export type DrawGamePhase = "waiting" | "drawing" | "guessing" | "reveal" | "finished";

export interface PhaseChangedEvent {
  roomId: string;
  roundNumber: number;
  phase: DrawGamePhase;
  durationSeconds: number;
  startTime: string;
}

export interface DrawGameHubContract {
  server: {
    JoinRoom(roomId: string, request: DrawPlayerJoinRequest): Promise<void>;
    LeaveRoom(roomId: string, player: DrawPlayer): Promise<void>;
    SendRoomMessage(roomId: string, message: string): Promise<void>;
    KickPlayer(roomId: string, player: DrawPlayer): Promise<void>;
    SetRoomState(roomId: string, state: DrawGameState["phase"]): Promise<void>;
    StartRound(roomId: string, roundNumber: number): Promise<void>;
    EndRound(roomId: string): Promise<void>;
    SendDrawAction(roomId: string, action: DrawAction): Promise<void>;
    SendLiveDrawAction(roomId: string, action: DrawAction): Promise<void>;
  };
  client: {
    JoinRoom(player: DrawPlayer): void;
    LeaveRoom(): void;
    UserJoined(player: DrawPlayer): void;
    UserLeft(player: DrawPlayer): void;
    RoomMessageReceived(senderId: string, senderName: string, message: string): void;
    RoomDeleted(): void;
    RoomStateUpdated(state: DrawGameState["phase"]): void;
    DrawActionReceived(action: DrawAction): void;
    LiveDrawActionReceived(action: DrawAction): void;
    RoundStarted(round: RoundStartedEvent): void;
    RoundEnded(round: RoundEndedEvent): void;
    PhaseChanged(phase: PhaseChangedEvent): void;
  };
}

export type SignalRMethod = (...args: unknown[]) => Promise<unknown>;
export type EventHandler = (...args: unknown[]) => void;

export type DrawGameEventHandlers = {
  [K in keyof DrawGameHubContract["client"] as `on${K}`]?: DrawGameHubContract["client"][K];
};

export * from "./draw-action";
