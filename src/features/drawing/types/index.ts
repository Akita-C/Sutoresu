import { DrawAction } from "./draw-action";

export type CreateDrawRoomRequest = {
  roomName: string;
  config: {
    maxPlayers: number;
    maxRoundPerPlayers: number;
    drawingDurationSeconds: number;
    guessingDurationSeconds: number;
    revealDurationSeconds: number;
    wordRevealIntervalSeconds: number;
    maxWordRevealPercentage: number;
    enableWordReveal: boolean;
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
    wordRevealIntervalSeconds: number;
    maxWordRevealPercentage: number;
    enableWordReveal: boolean;
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
  currentDrawerId: string;
  currentWord: string;
}

export interface EndedGameEvent {
  roomId: string;
}

export type DrawGamePhase = "waiting" | "drawing" | "guessing" | "reveal" | "finished";

type BasePhaseChangedEvent = {
  roomId: string;
  roundNumber: number;
  durationSeconds: number;
  startTime: string;
};

export type PhaseChangedEvent = BasePhaseChangedEvent &
  (
    | { phase: "drawing"; currentDrawerId: string }
    | { phase: "reveal"; currentWord: string }
    | { phase: Exclude<DrawGamePhase, "drawing" | "reveal"> }
  );

export type PlayerScore = Pick<DrawPlayer, "playerId" | "playerName" | "playerAvatar"> & {
  score: number;
};

export type PlayerGuessMessage = Partial<
  Pick<DrawPlayer, "playerId" | "playerName" | "playerAvatar">
> &
  (
    | {
        type: "wrong";
        message: string;
      }
    | {
        type: "correct";
      }
  );

export type WordRevealedEvent = {
  roomId: string;
  revealedWord: string;
};

export interface DrawGameHubContract {
  server: {
    JoinRoom(roomId: string, request: DrawPlayerJoinRequest): Promise<void>;
    LeaveRoom(roomId: string, player: DrawPlayer): Promise<void>;
    SendRoomMessage(roomId: string, message: string): Promise<void>;
    KickPlayer(roomId: string, player: DrawPlayer): Promise<void>;
    StartRound(roomId: string): Promise<void>;
    SendDrawAction(roomId: string, action: DrawAction): Promise<void>;
    SendGuessMessage(roomId: string, message: string): Promise<void>;
    RequestRematch(roomId: string, newConfig?: CreateDrawRoomRequest["config"]): Promise<void>;
  };
  client: {
    NotifyAccessDenied(): void;
    JoinRoom(player: DrawPlayer): void;
    LeaveRoom(): void;
    UserJoined(player: DrawPlayer): void;
    UserLeft(player: DrawPlayer): void;
    RoomMessageReceived(senderId: string, senderName: string, message: string): void;
    RoomDeleted(): void;
    DrawActionReceived(action: DrawAction): void;
    RoundStarted(round: RoundStartedEvent): void;
    EndedGame(round: EndedGameEvent): void;
    PhaseChanged(phase: PhaseChangedEvent): void;
    WordToDraw(word: string): void;
    WordRevealed(word: WordRevealedEvent): void;
    GuessMessageWrongReceived(playerId: string, message: string): void;
    GuessMessageCorrectReceived(playerId: string, newScore: number): void;
    RematchRoomCreated(
      roomId: string,
      hostName: string,
      config: CreateDrawRoomRequest["config"],
    ): void;
  };
}

export type SignalRMethod = (...args: unknown[]) => Promise<unknown>;
export type EventHandler = (...args: unknown[]) => void;

export type DrawGameEventHandlers = {
  [K in keyof DrawGameHubContract["client"] as `on${K}`]?: DrawGameHubContract["client"][K];
};

export * from "./draw-action";
