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

const PHASE_GRADIENT_CLASS: Record<string, string> = {
  waiting:
    'bg-[radial-gradient(ellipse_at_12%_92%,rgba(239,68,68,0.18)_0%,rgba(88,28,55,0.14)_34%,rgba(15,16,27,0.04)_56%,transparent_74%)]',
  running:
    'bg-[radial-gradient(ellipse_at_12%_92%,rgba(34,197,94,0.18)_0%,rgba(20,83,45,0.14)_34%,rgba(15,16,27,0.04)_56%,transparent_74%)]',
  crashed:
    'bg-[radial-gradient(ellipse_at_12%_92%,rgba(239,68,68,0.2)_0%,rgba(88,28,55,0.16)_34%,rgba(15,16,27,0.04)_56%,transparent_74%)]',
}

export function CrashChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phase = useGameStore((s) => s.phase)
  const crashFlash = useGameStore((s) => s.crashFlash)

  useCrashChart(canvasRef)

  return (
    <div
      className={[
        'relative flex min-h-0 flex-1 overflow-hidden rounded-xl border border-border transition-colors duration-700',
        crashFlash ? 'bg-accent-red/5' : 'bg-bg-panel',
      ].join(' ')}
    >
      <div
        className={[
          'pointer-events-none absolute inset-0 z-0 transition-colors duration-700',
          PHASE_GRADIENT_CLASS[phase] ?? PHASE_GRADIENT_CLASS.waiting,
        ].join(' ')}
      />

      {/* Phase badge */}
      <div className="absolute left-3 top-3 z-20">
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
        className="relative z-10 h-full w-full"
        style={{ display: 'block' }}
      />
    </div>
  )
}