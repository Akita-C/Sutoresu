import { create } from "zustand";
import { DrawGamePhase, DrawWaitingRoomMessage, PhaseChangedEvent, RoundEndedEvent, RoundStartedEvent } from "../types";

export interface DrawGameState {
  phase: DrawGamePhase;
  waitingRoomMessages: DrawWaitingRoomMessage[];
  currentRound: number | null;
  totalRounds: number | null;
  roundStartTime: Date | null;
  roundDurationSeconds: number | null;
  isRoundActive: boolean;
  phaseStartTime: Date | null;
  phaseDurationSeconds: number | null;
}

interface DrawGameActions {
  setPhase: (phase: DrawGameState["phase"]) => void;
  setWaitingRoomMessages: (messages: DrawWaitingRoomMessage[]) => void;
  startRound: (roundEvent: RoundStartedEvent) => void;
  endRound: (roundEvent: RoundEndedEvent) => void;
  changePhase: (phaseEvent: PhaseChangedEvent) => void;
  getRemainingSeconds: () => number | null;
  getPhaseRemainingSeconds: () => number | null;
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
  phaseStartTime: null,
  phaseDurationSeconds: null,
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
      phase: roundEvent.isGameFinished ? "finished" : "waiting",
      isRoundActive: false,
      roundStartTime: null,
      phaseStartTime: null,
      phaseDurationSeconds: null,
    }),

  changePhase: (phaseEvent) =>
    set({
      phase: phaseEvent.phase,
      phaseStartTime: new Date(phaseEvent.startTime),
      phaseDurationSeconds: phaseEvent.durationSeconds,
    }),

  getRemainingSeconds: () => {
    const state = get();
    if (!state.isRoundActive || !state.roundStartTime || !state.roundDurationSeconds) return null;

    const elapsed = Math.floor((Date.now() - state.roundStartTime.getTime()) / 1000);
    const remaining = state.roundDurationSeconds - elapsed;
    return Math.max(0, remaining);
  },

  getPhaseRemainingSeconds: () => {
    const state = get();
    if (!state.phaseStartTime || !state.phaseDurationSeconds) return null;

    const elapsed = Math.floor((Date.now() - state.phaseStartTime.getTime()) / 1000);
    const remaining = state.phaseDurationSeconds - elapsed;
    return Math.max(0, remaining);
  },

  reset: () => set(initialState),
}));
