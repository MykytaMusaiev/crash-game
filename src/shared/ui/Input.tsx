'use client'

import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export function Input({
  label,
  error,
  hint,
  className = '',
  id,
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold uppercase tracking-wider text-text-secondary"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          w-full rounded-md border border-border bg-bg-secondary
          px-3 py-2.5 text-sm text-text-primary
          placeholder:text-text-secondary
          focus:border-accent-gold focus:outline-none
          transition-colors
          ${error ? 'border-accent-red' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs text-accent-red">{error}</span>
      )}
      {hint && !error && (
        <span className="text-xs text-text-secondary">{hint}</span>
      )}
    </div>
  )
}