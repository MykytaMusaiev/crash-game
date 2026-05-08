import { Howl } from "howler";
import { useAudioStore } from "@/store/audioStore";
import type { SoundName } from "@/shared/types/audioTypes";

class AudioService {
    private _sounds: Partial<Record<SoundName, Howl>> = {};

    private getSound(name: SoundName): Howl {
        if (!this._sounds[name]) {
            this._sounds[name] = new Howl({ src: [`/sounds/${name}.mp3`] });
        }
        return this._sounds[name]!;
    }

    play(sound: SoundName): void {
        if (useAudioStore.getState().isMuted) return; // Rule 33
        this.getSound(sound).play();
    }
}

export const audioService = new AudioService();
