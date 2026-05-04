'use client'

import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  fullWidth?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent-gold text-bg-primary hover:opacity-90',
  secondary: 'bg-bg-panel text-text-primary border border-border hover:border-text-secondary',
  danger: 'bg-accent-red text-white hover:opacity-90',
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        flex items-center justify-center rounded-md px-4 py-2.5
        font-semibold text-sm transition-opacity
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}