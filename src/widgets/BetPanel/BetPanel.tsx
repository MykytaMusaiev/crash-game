'use client'

import { useCallback, useMemo } from 'react'
import { useGameStore } from '@/store/gameStore'
import { useBetStore } from '@/store/betStore'
import { socketService } from '@/shared/api/socketService'
import { SOCKET_EVENTS } from '@/shared/constants/socketEvents'
import { APP_CONSTANTS } from '@/shared/constants/appConstants'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Toggle } from '@/shared/ui/Toggle'
import { clampBet } from '@/shared/utils/clampBet'
import { formatBalance } from '@/shared/utils/formatBalance'
import type { BetPlaceEmit } from '@/shared/types/socketTypes'
import { QuickBetMultipliers } from '@/shared/ui/QuickBetMultipliers'
import { clampAutoCashOut } from '@/shared/utils/clampAutoCashOut'
import { cn } from '@/shared/lib/cn'
import { getBetButtonState } from '@/shared/utils/getBetButtonState'

interface BetPanelProps {
  className?: string
}

export function BetPanel({ className }: BetPanelProps) {
  const phase = useGameStore((s) => s.phase)
  const myBet = useGameStore((s) => s.myBet)
  const balance = useGameStore((s) => s.balance)
  const actionInFlight = useGameStore((s) => s.actionInFlight)
  const setActionInFlight = useGameStore((s) => s.setActionInFlight)
  const crashPoint = useGameStore((s) => s.crashPoint)
  const hadBetThisRound = useGameStore((s) => s.hadBetThisRound)
  const hadCashedOutThisRound = useGameStore((s) => s.hadCashedOutThisRound)
  const cashedOutWinAmount = useGameStore((s) => s.cashedOutWinAmount)

  const betAmount = useBetStore((s) => s.betAmount)
  const setBetAmount = useBetStore((s) => s.setBetAmount)
  const autoCashOutAt = useBetStore((s) => s.autoCashOutAt)
  const setAutoCashOutAt = useBetStore((s) => s.setAutoCashOutAt)
  const autoCashOutEnabled = useBetStore((s) => s.autoCashOutEnabled)
  const setAutoCashOutEnabled = useBetStore((s) => s.setAutoCashOutEnabled)

  // ── Derived state ──
  const canPlaceBet = phase === 'waiting' && myBet === null && !actionInFlight
  const canCashOut = phase === 'running' && myBet?.status === 'placed' && !actionInFlight
  const inputsDisabled = !canPlaceBet

  // ── Handlers ──
  const handleBetAmountChange = useCallback(
    (raw: string) => {
      const parsed = parseFloat(raw)
      if (!isNaN(parsed)) setBetAmount(clampBet(parsed, balance))
    },
    [balance, setBetAmount],
  )

  const handleAdjustBet = useCallback(
    (factor: number | 'max') => {
      const newAmount = factor === 'max' ? balance : Math.floor(betAmount * factor)
      setBetAmount(clampBet(newAmount, balance))
    },
    [betAmount, balance, setBetAmount],
  )

  const handleAutoCashOutChange = useCallback(
    (raw: string) => {
      const parsed = parseFloat(raw)
      if (!isNaN(parsed)) setAutoCashOutAt(clampAutoCashOut(parsed))
    },
    [setAutoCashOutAt],
  )

  const handlePlaceBet = useCallback(() => {
    if (!canPlaceBet) return
    setActionInFlight(true)
    const payload: BetPlaceEmit = {
      amount: betAmount,
      autoCashOutAt: autoCashOutEnabled ? autoCashOutAt : null,
    }
    socketService.emit<BetPlaceEmit>(SOCKET_EVENTS.BET_PLACE, payload)
  }, [canPlaceBet, betAmount, autoCashOutEnabled, autoCashOutAt, setActionInFlight])

  const handleCashOut = useCallback(() => {
    if (!canCashOut) return
    setActionInFlight(true)
    socketService.emit(SOCKET_EVENTS.BET_CASHOUT)
  }, [canCashOut, setActionInFlight])



  const btn = getBetButtonState({ phase, myBet, actionInFlight, crashPoint, hadBetThisRound, hadCashedOutThisRound, cashedOutWinAmount, balance, })
  const btnOnClick = canCashOut ? handleCashOut : canPlaceBet ? handlePlaceBet : undefined

  return (
    <div className={cn(
      'flex flex-col gap-4 w-full md:w-50 shrink-0 bg-bg-panel border-t border-border md:border-t-0 md:border-r p-4',
      className,
    )}>
      {/* ── Bet Amount ── */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary">
          Bet Amount
        </label>

        <Input
          type="number"
          min={APP_CONSTANTS.MIN_BET_AMOUNT}
          max={balance}
          step={1}
          value={betAmount}
          onChange={(e) => handleBetAmountChange(e.target.value)}
          disabled={inputsDisabled}
          suffix="USD"
          wrapperClassName="focus-within:border-text-secondary rounded-lg px-3 py-2"
        />

        <QuickBetMultipliers
          onAdjust={handleAdjustBet}
          disabled={inputsDisabled}
        />
      </div>

      {/* ── Auto Cash Out ── */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary">
            Auto Cash Out
          </span>

          <Toggle
            checked={autoCashOutEnabled}
            onChange={setAutoCashOutEnabled}
            disabled={inputsDisabled}
            aria-label="Toggle auto cash out"
          />
        </div>

        {autoCashOutEnabled && (
          <Input
            type="number"
            min={APP_CONSTANTS.MIN_AUTO_CASHOUT}
            step={APP_CONSTANTS.AUTO_CASHOUT_STEP}
            value={autoCashOutAt}
            onChange={(e) => handleAutoCashOutChange(e.target.value)}
            disabled={inputsDisabled}
            suffix="×"
            wrapperClassName="focus-within:border-text-secondary rounded-lg px-3 py-2"
          />
        )}
      </div>

      {/* ── Action Button ── */}
      <Button
        variant={btn.variant}
        fullWidth
        onClick={btnOnClick}
        disabled={btn.disabled}
        className={`rounded-xl py-3 text-sm ${btn.className}`}
      >
        {btn.label}
      </Button>

      {/* ── Balance ── */}
      <div className="flex items-center gap-1.5 border-t border-border pt-3">
        <span className="text-text-secondary text-xs">🪙</span>
        <span className="text-xs text-text-secondary">Balance</span>
        <span className="ml-auto text-sm font-semibold text-accent-gold tabular-nums">
          {formatBalance(balance)}
        </span>
      </div>
    </div>
  )
}