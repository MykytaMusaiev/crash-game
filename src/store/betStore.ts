import { create } from "zustand";

interface BetFormState {
    betAmount: number;
    autoCashOutAt: number;
    autoCashOutEnabled: boolean;
    // Actions
    setBetAmount: (amount: number) => void;
    setAutoCashOutAt: (value: number) => void;
    setAutoCashOutEnabled: (enabled: boolean) => void;
    reset: () => void;
}

const initialState = {
    betAmount: 10,
    autoCashOutAt: 2,
    autoCashOutEnabled: false,
};

export const useBetStore = create<BetFormState>((set) => ({
    ...initialState,

    setBetAmount: (betAmount) => set({ betAmount }),
    setAutoCashOutAt: (autoCashOutAt) => set({ autoCashOutAt }),
    setAutoCashOutEnabled: (autoCashOutEnabled) => set({ autoCashOutEnabled }),
    reset: () => set(initialState),
}));
