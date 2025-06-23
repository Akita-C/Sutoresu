import { create } from "zustand";
import { DrawWaitingRoomMessage } from "../types";

export interface DrawGameState {
  phase: "waiting" | "drawing" | "guessing" | "reveal" | "finished";
  waitingRoomMessages: DrawWaitingRoomMessage[];
  // currentRound: number;
  // currentDrawer: DrawPlayer;
  // currentWord: string;
  // timeRemaining: number;
  // scores: Record<string, number>;
  setPhase: (phase: DrawGameState["phase"]) => void;
  setWaitingRoomMessages: (messages: DrawWaitingRoomMessage[]) => void;
}

export const useDrawGameStore = create<DrawGameState>((set) => ({
  phase: "waiting",
  waitingRoomMessages: [],
  setPhase: (phase) => set({ phase }),
  setWaitingRoomMessages: (messages) => set({ waitingRoomMessages: messages }),
}));
