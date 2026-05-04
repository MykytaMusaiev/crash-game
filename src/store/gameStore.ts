import { create } from "zustand";
import type { RoundPhase, MyBet } from "@/shared/types/gameTypes";

interface GameState {
    phase: RoundPhase;
    roundId: string | null;
    startedAt: Date | null;
    endsAt: Date | null;
    multiplier: number;
    crashPoint: number | null;
    myBet: MyBet | null;
    playerCount: number;
    balance: number;
    actionInFlight: boolean;
    crashFlash: boolean;
    // Actions
    setPhase: (phase: RoundPhase) => void;
    setRoundId: (roundId: string) => void;
    setStartedAt: (date: Date | null) => void;
    setEndsAt: (date: Date | null) => void;
    setMultiplier: (multiplier: number) => void;
    setCrashPoint: (crashPoint: number | null) => void;
    setMyBet: (bet: MyBet | null) => void;
    setPlayerCount: (playerCount: number) => void;
    setBalance: (balance: number) => void;
    setActionInFlight: (value: boolean) => void;
    setCrashFlash: (value: boolean) => void;
    reset: () => void;
}

const initialState = {
    phase: "waiting" as RoundPhase,
    roundId: null,
    startedAt: null,
    endsAt: null,
    multiplier: 1,
    crashPoint: null,
    myBet: null,
    playerCount: 0,
    balance: 0,
    actionInFlight: false,
    crashFlash: false,
};

export const useGameStore = create<GameState>((set) => ({
    ...initialState,

    setPhase: (phase) => set({ phase }),
    setRoundId: (roundId) => set({ roundId }),
    setStartedAt: (startedAt) => set({ startedAt }),
    setEndsAt: (endsAt) => set({ endsAt }),
    setMultiplier: (multiplier) => set({ multiplier }),
    setCrashPoint: (crashPoint) => set({ crashPoint }),
    setMyBet: (myBet) => set({ myBet }),
    setPlayerCount: (playerCount) => set({ playerCount }),
    setBalance: (balance) => set({ balance }),
    setActionInFlight: (actionInFlight) => set({ actionInFlight }),
    setCrashFlash: (crashFlash) => set({ crashFlash }),
    reset: () => set(initialState),
}));
