'use client'

import { useGameStore } from '@/store/gameStore'
import { socketService } from '@/shared/api/socketService'
import { storage } from '@/shared/lib/storage'
import {
  GAME_INSTANCE_SEARCH_PARAM,
  isValidGameInstanceId,
} from '@/shared/lib/gameInstance'
import { User, LogOut, Users } from 'lucide-react'
import { VolumeToggle } from './VolumeToggle'

interface StatusBarProps {
  onPlayersClick?: () => void
}

export function StatusBar({ onPlayersClick }: StatusBarProps) {
  const connected = useGameStore((s) => s.connected)
  const roundId = useGameStore((s) => s.roundId)
  const playerCount = useGameStore((s) => s.players.length)
  const username = useGameStore((s) => s.username)

  const handleLogout = () => {
    const searchParams = new URLSearchParams(window.location.search)
    const instanceId = searchParams.get(GAME_INSTANCE_SEARCH_PARAM)

    if (isValidGameInstanceId(instanceId)) {
      storage.removeInstanceApiKey(instanceId)

      const rememberedInstanceId = storage.getRememberedInstanceId()

      if (rememberedInstanceId === instanceId) {
        storage.removeRememberedInstanceId()
      }
    }

    storage.removeLegacyApiKey()
    socketService.disconnect()
    window.location.replace('/')
  }

  const roundLabel = roundId
    ? `R#${roundId.replace(/\D/g, '').slice(-4)}`
    : 'R—'

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
        {/* Desktop: full labels */}
        <span className="hidden md:inline">
          {connected ? 'Connected' : 'Disconnected'}
        </span>
        <span className="hidden md:inline text-border">·</span>
        <span>{roundLabel}</span>
        <span className="text-border">·</span>

        {/* Mobile: icon button that opens players modal */}
        <button
          onClick={onPlayersClick}
          className="flex items-center gap-1 md:hidden hover:text-text-primary transition-colors"
          aria-label="Show live players"
        >
          <Users size={13} />
          <span>{playerCount}</span>
        </button>

        {/* Desktop: plain text */}
        <span className="hidden md:inline">{playerCount} players</span>
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
          aria-label="Logout"
        >
          <LogOut size={14} />
        </button>
        <VolumeToggle />
      </div>
    </div>
  )
}
