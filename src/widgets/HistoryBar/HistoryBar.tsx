'use client'

import { useRef } from 'react'
import type { WheelEvent } from 'react'
import { useRecentRounds } from '@/shared/hooks/useRecentRounds'
import type { RoundTier } from '@/shared/types/gameTypes'

const TIER_CLASSES: Record<RoundTier, string> = {
  low: 'bg-accent-red/20 text-accent-red border-accent-red/40',
  mid: 'bg-accent-gold/20 text-accent-gold border-accent-gold/40',
  high: 'bg-accent-green/20 text-accent-green border-accent-green/40',
}

export function HistoryBar() {
  const { data: rounds } = useRecentRounds()
  const ref = useRef<HTMLDivElement>(null)

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollLeft += e.deltaY
    }
  }

  return (
    <div
      ref={ref}
      onWheel={handleWheel}
      className="flex h-10 w-full items-center gap-2 overflow-x-auto border-b border-border bg-bg-primary px-3"
      style={{ scrollbarWidth: 'none' }}
    >
      {rounds?.map((round) => (
        <span
          key={round.roundId}
          className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${TIER_CLASSES[round.tier]}`}
        >
          {round.crashPoint.toFixed(2)}×
        </span>
      ))}
    </div>
  )
}