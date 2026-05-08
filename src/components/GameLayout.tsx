'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useInitApp } from '@/shared/hooks/useInitApp'
import { useGameSocket } from '@/shared/hooks/useGameSocket'
import { storage } from '@/shared/lib/storage'
import { BetPanel } from '@/widgets/BetPanel/BetPanel'
import { CrashChart } from '@/widgets/CrashChart/CrashChart'
import { PlayersPanel } from '@/widgets/PlayersPanel/PlayersPanel'
import { HistoryBar } from '@/widgets/HistoryBar/HistoryBar'
import { StatusBar } from '@/widgets/StatusBar/StatusBar'
import { useBalance } from '@/shared/hooks/useBalance'
import { useRecentRounds } from '@/shared/hooks/useRecentRounds'

export function GameLayout() {
  const router = useRouter()
  const [showPlayersModal, setShowPlayersModal] = useState(false)

  // Protection of the route — if there is no apiKey >> to login.
  // This is a client guard: we check localStorage immediately upon mounting.
  useEffect(() => {
    if (!storage.getApiKey()) {
      router.replace('/')
    }
  }, [router])

  // Connects the socket
  useInitApp()

  // Subscribes to all WS events and writes to the gameStore
  useGameSocket()

  // gets the initial balance
  useBalance()
  // gets recent rounds result
  useRecentRounds()

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 min-h-0 flex-col md:flex-row">

        <BetPanel className="order-2 md:order-1" />

        <div className="order-1 md:order-2 flex flex-1 flex-col min-w-0 min-h-0">
          <HistoryBar />
          <CrashChart />
        </div>

        {/* Desktop: always visible sidebar */}
        <PlayersPanel className="order-3 hidden md:flex" />

      </div>

      {/* StatusBar: hidden on mobile via md:hidden → now always visible */}
      <StatusBar onPlayersClick={() => setShowPlayersModal(true)} />

      {/* Mobile players modal overlay */}
      {showPlayersModal && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={() => setShowPlayersModal(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Panel — slides in from the right */}
          <div
            className="absolute right-0 top-0 h-full w-72 bg-bg-panel shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <PlayersPanel onClose={() => setShowPlayersModal(false)} />
          </div>
        </div>
      )}
    </div>
  )
}