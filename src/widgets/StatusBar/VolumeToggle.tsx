'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { useAudioStore } from '@/store/audioStore';

export function VolumeToggle() {
  const isMuted = useAudioStore((s) => s.isMuted);
  const toggleMute = useAudioStore((s) => s.toggleMute);

  return (
    <button
      onClick={toggleMute}
      className="text-text-secondary hover:text-text-primary transition-colors"
      aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
    >
      {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
    </button>
  );
}