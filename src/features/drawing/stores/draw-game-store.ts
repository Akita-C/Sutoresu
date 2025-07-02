import { create } from "zustand";
import { DrawWaitingRoomMessage, RoundEndedEvent, RoundStartedEvent } from "../types";

export interface DrawGameState {
  phase: "waiting" | "drawing" | "guessing" | "reveal" | "finished";
  waitingRoomMessages: DrawWaitingRoomMessage[];
  currentRound: number | null;
  totalRounds: number | null;
  roundStartTime: Date | null;
  roundDurationSeconds: number | null;
  isRoundActive: boolean;
}

interface DrawGameActions {
  setPhase: (phase: DrawGameState["phase"]) => void;
  setWaitingRoomMessages: (messages: DrawWaitingRoomMessage[]) => void;
  startRound: (roundEvent: RoundStartedEvent) => void;
  endRound: (roundEvent: RoundEndedEvent) => void;
  getRemainingSeconds: () => number | null;
  reset: () => void;
}

const initialState: DrawGameState = {
  phase: "waiting",
  waitingRoomMessages: [],
  currentRound: null,
  totalRounds: null,
  roundStartTime: null,
  roundDurationSeconds: null,
  isRoundActive: false,
};

export const useDrawGameStore = create<DrawGameState & DrawGameActions>((set, get) => ({
  ...initialState,

  setPhase: (phase) => set({ phase }),

  setWaitingRoomMessages: (messages) => set({ waitingRoomMessages: messages }),

  startRound: (roundEvent) =>
    set({
      phase: "drawing",
      currentRound: roundEvent.roundNumber,
      totalRounds: roundEvent.totalRounds,
      roundStartTime: new Date(roundEvent.startTime),
      roundDurationSeconds: roundEvent.durationSeconds,
      isRoundActive: true,
    }),

  endRound: (roundEvent) =>
    set({
      phase: roundEvent.isGameFinished ? "finished" : "guessing",
      isRoundActive: false,
      roundStartTime: null,
    }),

  getRemainingSeconds: () => {
    const state = get();
    if (!state.isRoundActive || !state.roundStartTime || !state.roundDurationSeconds) return null;

    const elapsed = Math.floor((Date.now() - state.roundStartTime.getTime()) / 1000);
    const remaining = state.roundDurationSeconds - elapsed;
    return Math.max(0, remaining);
  },

  reset: () => set(initialState),
}));
