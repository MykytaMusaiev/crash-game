'use client'

import { useState } from 'react'
import { BetPanel } from '@/widgets/BetPanel/BetPanel'
import { CrashChart } from '@/widgets/CrashChart/CrashChart'
import { HistoryBar } from '@/widgets/HistoryBar/HistoryBar'
import { PlayersPanel } from '@/widgets/PlayersPanel/PlayersPanel'
import { StatusBar } from '@/widgets/StatusBar/StatusBar'
import { useBalance } from '@/shared/hooks/useBalance'
import { useGameSocket } from '@/shared/hooks/useGameSocket'
import { useInitApp } from '@/shared/hooks/useInitApp'
import { useRecentRounds } from '@/shared/hooks/useRecentRounds'

export function GameLayout() {
  const [showPlayersModal, setShowPlayersModal] = useState(false)

  // Connects the socket
  useInitApp()

  // Subscribes to all WS events and writes to the gameStore
  useGameSocket()

  // Gets the initial balance
  useBalance()

  // Gets recent rounds result
  useRecentRounds()

  return (
    <div className="flex h-screen flex-col bg-bg-primary">
      <div className="flex min-h-0 flex-1 flex-col gap-2 p-2 md:flex-row md:gap-3 md:p-3">
        <BetPanel className="order-2 md:order-1" />

        <div className="order-1 flex min-h-0 min-w-0 flex-1 flex-col gap-2 md:order-2">
          <HistoryBar />
          <CrashChart />
        </div>

        {/* Desktop: always visible sidebar */}
        <PlayersPanel className="order-3 hidden md:flex" />
      </div>

      <StatusBar onPlayersClick={() => setShowPlayersModal(true)} />

      {/* Mobile players modal overlay */}
      {showPlayersModal && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowPlayersModal(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm motion-safe:animate-[mobileBackdropFadeIn_180ms_ease-out]" />

          {/* Panel */}
          <div
            className="absolute right-0 top-0 h-full w-72 bg-bg-panel shadow-2xl motion-safe:animate-[mobilePlayersPanelSlideIn_200ms_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <PlayersPanel onClose={() => setShowPlayersModal(false)} />
          </div>
        </div>
      )}
    </div>
  )
}