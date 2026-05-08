'use client'

import { useGameStore } from '@/store/gameStore'
import { PlayerRow } from './PlayerRow'
import { cn } from '@/shared/lib/cn'
import { Users, X } from 'lucide-react'

interface PlayersPanelProps {
  className?: string
  /** When provided, renders a modal-style header with a close button */
  onClose?: () => void
}

export function PlayersPanel({ className, onClose }: PlayersPanelProps) {
  const players = useGameStore((s) => s.players)
  const isModal = Boolean(onClose)

  return (
    <div className={cn(
      'flex flex-col border-border bg-bg-panel',
      isModal
        ? 'w-full h-full'
        : 'w-64 shrink-0 border-l',
      className,
    )}>
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        {isModal && <Users size={14} className="text-text-secondary" />}
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Live Players
        </span>
        <span className="rounded-full bg-bg-secondary px-2 py-0.5 text-xs font-bold text-text-primary">
          {players.length}
        </span>

        {/* Close button — only in modal mode */}
        {isModal && (
          <button
            onClick={onClose}
            className="ml-auto text-text-secondary transition-colors hover:text-text-primary"
            aria-label="Close players panel"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Player list */}
      <div className="flex-1 overflow-y-auto">
        {players.map((player) => (
          <PlayerRow key={player.username} player={player} />
        ))}
      </div>
    </div>
  )
}