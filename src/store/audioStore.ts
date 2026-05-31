import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AudioState {
    isMuted: boolean;
    toggleMute: () => void;
}

export const useAudioStore = create<AudioState>()(
    persist(
        (set) => ({
            isMuted: false,
            toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
        }),
        { name: "audio_muted" },
    ),
);
