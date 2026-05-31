'use client'

import type { InputHTMLAttributes, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  suffix?: ReactNode
  wrapperClassName?: string
}

export function Input({
  label,
  error,
  hint,
  suffix,
  wrapperClassName = '',
  className = '',
  id,
  type,
  ...props
}: InputProps) {
  const isNumber = type === 'number'

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
      <div
        className={`
          flex items-center
          rounded-md border border-border bg-bg-secondary
          focus-within:border-accent-gold transition-colors
          ${error ? 'border-accent-red' : ''}
          ${wrapperClassName}
        `}
      >
        <input
          id={id}
          type={type}
          className={`
            flex-1 min-w-0 bg-transparent
            px-3 py-2.5 text-sm text-text-primary
            placeholder:text-text-secondary
            focus:outline-none
            ${isNumber ? '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' : ''}
            ${className}
          `}
          {...props}
        />
        {suffix && (
          <span className="shrink-0 pr-3 text-xs text-text-secondary">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <span className="text-xs text-accent-red">{error}</span>
      )}
      {hint && !error && (
        <span className="text-xs text-text-secondary">{hint}</span>
      )}
    </div>
  )
}