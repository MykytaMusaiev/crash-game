'use client'

import { useGameStore } from '@/store/gameStore'
import { PlayerRow } from './PlayerRow'

export function PlayersPanel() {
  const players = useGameStore((s) => s.players)

  return (
    <div className="flex w-64 shrink-0 flex-col border-l border-border bg-bg-panel">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Live Players
        </span>
        <span className="rounded-full bg-bg-secondary px-2 py-0.5 text-xs font-bold text-text-primary">
          {players.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {players.map((player) => (
          <PlayerRow key={player.username} player={player} />
        ))}
      </div>
    </div>
  )
}