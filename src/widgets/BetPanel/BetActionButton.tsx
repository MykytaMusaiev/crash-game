'use client'

import { useGameStore } from '@/store/gameStore'
import { Button } from '@/shared/ui/Button'
import { getBetButtonState } from '@/shared/utils/getBetButtonState'

interface BetActionButtonProps {
  onPlaceBet: () => void
  onCashOut: () => void
}

export function BetActionButton({ onPlaceBet, onCashOut }: BetActionButtonProps) {
  const phase = useGameStore((s) => s.phase)
  const myBet = useGameStore((s) => s.myBet)
  const multiplier = useGameStore((s) => s.multiplier)
  const actionInFlight = useGameStore((s) => s.actionInFlight)
  const crashPoint = useGameStore((s) => s.crashPoint)
  const hadBetThisRound = useGameStore((s) => s.hadBetThisRound)
  const hadCashedOutThisRound = useGameStore((s) => s.hadCashedOutThisRound)
  const cashedOutWinAmount = useGameStore((s) => s.cashedOutWinAmount)
  const balance = useGameStore((s) => s.balance)

  const canPlaceBet = phase === 'waiting' && myBet === null && !actionInFlight
  const canCashOut = phase === 'running' && myBet?.status === 'placed' && !actionInFlight

  const btn = getBetButtonState({
    phase, myBet, actionInFlight, crashPoint,
    hadBetThisRound, hadCashedOutThisRound,
    cashedOutWinAmount, balance, multiplier,
  })

  const handleClick = canCashOut ? onCashOut : canPlaceBet ? onPlaceBet : undefined

  return (
    <Button
      variant={btn.variant}
      fullWidth
      onClick={handleClick}
      disabled={btn.disabled}
      className={`rounded-xl py-3 text-sm ${btn.className}`}
    >
      {btn.label}
    </Button>
  )
}