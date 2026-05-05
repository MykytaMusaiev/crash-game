'use client'

import { getAvatarColor } from '@/shared/lib/avatarUtils'
import type { PublicPlayer, PublicPlayerStatus } from '@/shared/types/playerTypes'

const STATUS_LABEL: Record<PublicPlayerStatus, string> = {
  placed: 'Bet',
  cashed_out: '',
  lost: 'Lost',
}

const STATUS_CLASSES: Record<PublicPlayerStatus, string> = {
  placed: 'text-accent-gold',
  cashed_out: 'text-accent-green',
  lost: 'text-accent-red',
}

export function PlayerRow({ player }: { player: PublicPlayer }) {
  const initial = player.username.charAt(0).toUpperCase()
  const avatarColor = getAvatarColor(player.username)

  return (
    <div className="flex items-center gap-3 px-4 py-2">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${avatarColor}`}>
        {initial}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-text-primary">
          {player.username}
        </span>
        <span className="text-xs text-text-secondary">
          {player.amount} USD
        </span>
      </div>
      <div className={`shrink-0 text-sm font-semibold ${STATUS_CLASSES[player.status]}`}>
        {player.status === 'cashed_out'
          ? `${player.multiplier?.toFixed(2)}×`
          : STATUS_LABEL[player.status]}
      </div>
    </div>
  )
}