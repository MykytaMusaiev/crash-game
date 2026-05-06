'use client'

import { useRef } from 'react'
import { useGameStore } from '@/store/gameStore'
import { useCrashChart } from './useCrashChart'

const PHASE_LABEL: Record<string, string> = {
  waiting: 'WAITING',
  running: 'RUNNING',
  crashed: 'CRASHED',
}

const PHASE_BADGE_CLASS: Record<string, string> = {
  waiting: 'text-accent-gold border-accent-gold/30 bg-accent-gold/10',
  running: 'text-accent-green border-accent-green/30 bg-accent-green/10',
  crashed: 'text-accent-red border-accent-red/30 bg-accent-red/10',
}

export function CrashChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phase = useGameStore((s) => s.phase)
  const crashFlash = useGameStore((s) => s.crashFlash)

  useCrashChart(canvasRef)

  return (
    <div
      className={[
        'relative flex min-h-0 flex-1 overflow-hidden transition-colors duration-700',
        crashFlash ? 'bg-accent-red/5' : 'bg-bg-primary',
      ].join(' ')}
    >
      {/* Phase badge */}
      <div className="absolute left-3 top-3 z-10">
        <span
          className={[
            'rounded border px-2 py-0.5 text-xs font-semibold uppercase tracking-widest',
            PHASE_BADGE_CLASS[phase] ?? PHASE_BADGE_CLASS.waiting,
          ].join(' ')}
        >
          {PHASE_LABEL[phase] ?? phase}
        </span>
      </div>

      {/* Canvas — fills the entire container */}
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ display: 'block' }}
      />
    </div>
  )
}