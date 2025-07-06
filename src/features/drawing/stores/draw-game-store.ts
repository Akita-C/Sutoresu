import { create } from "zustand";
import {
  DrawGamePhase,
  DrawWaitingRoomMessage,
  PhaseChangedEvent,
  PlayerGuessMessage,
  PlayerScore,
  RoundStartedEvent,
} from "../types";
import { useAuthStore } from "@/features/auth";

export interface DrawGameState {
  phase: DrawGamePhase;
  waitingRoomMessages: DrawWaitingRoomMessage[];
  playerScores: PlayerScore[];
  playerHearts: number;
  playerGuesses: PlayerGuessMessage[];
  currentRound: number | null;
  totalRounds: number | null;
  phaseStartTime: Date | null;
  phaseDurationSeconds: number | null;
  currentDrawerId: string | null;
  currentWord: string | null;
}

interface DrawGameActions {
  setWaitingRoomMessages: (messages: DrawWaitingRoomMessage) => void;
  startRound: (roundEvent: RoundStartedEvent) => void;
  endGame: () => void;
  changePhase: (phaseEvent: PhaseChangedEvent) => void;
  setPlayerScores: (scores: PlayerScore[]) => void;
  setCurrentWord: (word: string) => void;
  handleGuessMessage: (
    guessMessage: Pick<PlayerGuessMessage, "playerId" | "type"> &
      ({ type: "wrong"; message: string } | { type: "correct"; newScore: number }),
  ) => void;
  getRemainingSeconds: () => number | null;
  getPhaseRemainingSeconds: () => number | null;
  reset: () => void;
}

export const MAX_HEARTS = 3;

const initialState: DrawGameState = {
  phase: "waiting",
  waitingRoomMessages: [],
  playerScores: [],
  playerHearts: MAX_HEARTS,
  playerGuesses: [],
  currentRound: null,
  totalRounds: null,
  phaseStartTime: null,
  phaseDurationSeconds: null,
  currentDrawerId: null,
  currentWord: null,
};

export const useDrawGameStore = create<DrawGameState & DrawGameActions>((set, get) => ({
  ...initialState,

  setWaitingRoomMessages: (messages) =>
    set((state) => ({
      waitingRoomMessages: [...state.waitingRoomMessages, messages],
    })),

  setCurrentWord: (word) => set({ currentWord: word }),

  startRound: (roundEvent) =>
    set({
      phase: "drawing",
      currentRound: roundEvent.roundNumber,
      totalRounds: roundEvent.totalRounds,
      phaseStartTime: new Date(roundEvent.startTime),
      phaseDurationSeconds: roundEvent.durationSeconds,
      currentDrawerId: roundEvent.currentDrawerId,
    }),

  endGame: () =>
    set({
      phase: "finished",
      phaseStartTime: null,
      phaseDurationSeconds: null,
    }),

  changePhase: (phaseEvent) => {
    switch (phaseEvent.phase) {
      case "drawing":
        set({
          phase: "drawing",
          currentRound: phaseEvent.roundNumber,
          phaseStartTime: new Date(phaseEvent.startTime),
          phaseDurationSeconds: phaseEvent.durationSeconds,
          currentDrawerId: phaseEvent.currentDrawerId,
          playerHearts: MAX_HEARTS,
          playerGuesses: [],
        });
        break;
      case "reveal":
        set({
          phase: "reveal",
          currentRound: phaseEvent.roundNumber,
          phaseStartTime: new Date(phaseEvent.startTime),
          phaseDurationSeconds: phaseEvent.durationSeconds,
          currentWord: phaseEvent.currentWord,
        });
        break;
      default:
        set({
          phase: phaseEvent.phase,
          currentRound: phaseEvent.roundNumber,
          phaseStartTime: new Date(phaseEvent.startTime),
          phaseDurationSeconds: phaseEvent.durationSeconds,
        });
    }
  },

  setPlayerScores: (scores) => set({ playerScores: scores }),

  handleGuessMessage: (guessMessage) => {
    const currentUserId = useAuthStore.getState().user?.id;
    if (guessMessage.type === "wrong") {
      set((state) => ({
        playerHearts:
          guessMessage.playerId === currentUserId ? state.playerHearts - 1 : state.playerHearts,
        playerGuesses: [
          ...state.playerGuesses,
          {
            type: "wrong",
            message: guessMessage.message,
            playerId: guessMessage.playerId,
            playerName: state.playerScores.find((score) => score.playerId === guessMessage.playerId)
              ?.playerName,
            playerAvatar: state.playerScores.find(
              (score) => score.playerId === guessMessage.playerId,
            )?.playerAvatar,
          },
        ],
      }));
    } else {
      set((state) => ({
        playerHearts: guessMessage.playerId === currentUserId ? 0 : state.playerHearts,
        playerScores: state.playerScores.map((playerScore) => {
          if (playerScore.playerId === guessMessage.playerId) {
            return { ...playerScore, score: guessMessage.newScore };
          }
          return playerScore;
        }),
        playerGuesses: [
          ...state.playerGuesses,
          {
            type: "correct",
            playerId: guessMessage.playerId,
            playerName: state.playerScores.find((score) => score.playerId === guessMessage.playerId)
              ?.playerName,
            playerAvatar: state.playerScores.find(
              (score) => score.playerId === guessMessage.playerId,
            )?.playerAvatar,
          },
        ],
      }));
    }
  },

  getRemainingSeconds: () => {
    const state = get();
    if (!state.phaseStartTime || !state.phaseDurationSeconds) return null;

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
