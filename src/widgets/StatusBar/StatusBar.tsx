'use client'

import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'
import { socketService } from '@/shared/api/socketService'
import { storage } from '@/shared/lib/storage'
import { User, LogOut, Volume2 } from 'lucide-react';
import { VolumeToggle } from './VolumeToggle'

export function StatusBar() {
  const router = useRouter()
  const connected = useGameStore((s) => s.connected)
  const roundId = useGameStore((s) => s.roundId)
  const playerCount = useGameStore((s) => s.players.length)

  const username = useGameStore((s) => s.username)

  const handleLogout = () => {
    storage.removeApiKey()
    socketService.disconnect()
    router.push('/')
  }

  const roundLabel = roundId
    ? `Round #${roundId.replace(/\D/g, '').slice(-4)}`
    : 'Round —'

  return (
    <div className="flex h-9 shrink-0 items-center justify-between border-t border-border bg-bg-secondary px-4">
      {/* Left — connection + round info */}
      <div className="flex items-center gap-2 text-xs text-text-secondary">
        <span
          className={[
            'h-1.5 w-1.5 rounded-full',
            connected ? 'bg-accent-green' : 'bg-accent-red',
          ].join(' ')}
        />
        <span>{connected ? 'Connected' : 'Disconnected'}</span>
        <span className="text-border">·</span>
        <span>{roundLabel}</span>
        <span className="text-border">·</span>
        <span>{playerCount} players</span>
      </div>

      {/* Right — username + logout */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <User size={13} />
          <span>{username}</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-text-secondary transition-colors hover:text-accent-red"
        >
          <LogOut size={14} />
        </button>
        <VolumeToggle />
      </div>
    </div>
  )
}