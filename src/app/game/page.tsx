import { BetPanel } from '@/widgets/BetPanel/BetPanel'
import { CrashChart } from '@/widgets/CrashChart/CrashChart'
import { PlayersPanel } from '@/widgets/PlayersPanel/PlayersPanel'
import { HistoryBar } from '@/widgets/HistoryBar/HistoryBar'

export default function GamePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HistoryBar />
      <div className="flex flex-1">
        <BetPanel />
        <CrashChart />
        <PlayersPanel />
      </div>
    </div>
  )
}