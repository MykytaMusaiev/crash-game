'use client'

import { Button } from '@/shared/ui/Button'

interface QuickBetMultipliersProps {
  onAdjust: (factor: number | 'max') => void
  disabled?: boolean
  className?: string
}

const MULTIPLIERS = [
  { label: '½', factor: 0.5 },
  { label: '×2', factor: 2 },
  { label: 'Max', factor: 'max' as const },
] as const;

export function QuickBetMultipliers({
  onAdjust,
  disabled = false,
  className = '',
}: QuickBetMultipliersProps) {
  return (
    <div className={`flex gap-1.5 ${className}`}>
      {MULTIPLIERS.map((cfg) => (
        <Button
          key={cfg.label}
          variant="secondary"
          size="sm"
          onClick={() => onAdjust(cfg.factor)}
          disabled={disabled}
          className="flex-1"
        >
          {cfg.label}
        </Button>
      ))}
    </div>
  )
}