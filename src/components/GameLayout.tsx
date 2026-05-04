'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useInitApp } from '@/shared/hooks/useInitApp'
import { useGameSocket } from '@/shared/hooks/useGameSocket'
import { storage } from '@/shared/lib/storage'
import { BetPanel } from '@/widgets/BetPanel/BetPanel'
import { CrashChart } from '@/widgets/CrashChart/CrashChart'
import { PlayersPanel } from '@/widgets/PlayersPanel/PlayersPanel'
import { HistoryBar } from '@/widgets/HistoryBar/HistoryBar'
import { StatusBar } from '@/widgets/StatusBar/StatusBar'

export function GameLayout() {
  const router = useRouter()

  // Protection of the route — if there is no apiKey >> to  login.
  // This is a client guard: we check localStorage immediately upon mounting.
  useEffect(() => {
    if (!storage.getApiKey()) {
      router.replace('/')
    }
  }, [router])

  // Connects the socket and gets the initial balance
  useInitApp()

  // Subscribes to all WS events and writes to the gameStore
  useGameSocket()

  return (
    <div className="flex min-h-screen flex-col">
      <HistoryBar />
      <div className="flex flex-1">
        <BetPanel />
        <CrashChart />
        <PlayersPanel />
      </div>
      <StatusBar />
    </div>
  )
}