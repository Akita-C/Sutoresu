import { create } from "zustand";
import { DrawGamePhase, DrawWaitingRoomMessage, PhaseChangedEvent, RoundStartedEvent } from "../types";

export interface DrawGameState {
  phase: DrawGamePhase;
  waitingRoomMessages: DrawWaitingRoomMessage[];
  currentRound: number | null;
  totalRounds: number | null;
  isRoundActive: boolean;
  phaseStartTime: Date | null;
  phaseDurationSeconds: number | null;
}

interface DrawGameActions {
  setPhase: (phase: DrawGameState["phase"]) => void;
  setWaitingRoomMessages: (messages: DrawWaitingRoomMessage[]) => void;
  startRound: (roundEvent: RoundStartedEvent) => void;
  endGame: () => void;
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
      phaseStartTime: new Date(roundEvent.startTime),
      phaseDurationSeconds: roundEvent.durationSeconds,
      isRoundActive: true,
    }),

  endGame: () =>
    set({
      phase: "finished",
      isRoundActive: false,
      phaseStartTime: null,
      phaseDurationSeconds: null,
    }),

  changePhase: (phaseEvent) =>
    set({
      phase: phaseEvent.phase,
      currentRound: phaseEvent.roundNumber,
      phaseStartTime: new Date(phaseEvent.startTime),
      phaseDurationSeconds: phaseEvent.durationSeconds,
    }),

  getRemainingSeconds: () => {
    const state = get();
    if (!state.isRoundActive || !state.phaseStartTime || !state.phaseDurationSeconds) return null;

    const elapsed = Math.floor((Date.now() - state.phaseStartTime.getTime()) / 1000);
    const remaining = state.phaseDurationSeconds - elapsed;
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
