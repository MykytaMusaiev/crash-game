'use client'

import { useState } from 'react'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { storage } from '@/shared/lib/storage'
import { APP_CONSTANTS } from '@/shared/constants/appConstants'
import {
  createGameInstanceId,
  createGameUrl,
} from '@/shared/lib/gameInstance'

export function LoginForm() {
  const [username, setUsername] = useState('')
  const [touched, setTouched] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const isValid = username.length >= APP_CONSTANTS.MIN_USERNAME_LENGTH
  const showError = touched && !isValid

  function handleSubmit() {
    setTouched(true)
    if (!isValid) return

    const instanceId = createGameInstanceId()

    storage.removeLegacyApiKey()
    storage.setInstanceApiKey(instanceId, username, rememberMe)

    if (rememberMe) {
      storage.setRememberedInstanceId(instanceId)
    } else {
      storage.removeRememberedInstanceId()
    }

    window.location.replace(createGameUrl(instanceId))
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary">
      <div className="w-full max-w-sm rounded-xl border border-border bg-bg-panel p-8">
        {/* Logo and title */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-secondary text-2xl">
            📈
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              <span className="text-accent-gold">Crash</span>
              <span className="text-text-primary"> Game</span>
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              High-stakes real-time betting. Cash out before the crash.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <Input
            id="username"
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={() => setTouched(true)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            error={
              showError
                ? `Minimum ${APP_CONSTANTS.MIN_USERNAME_LENGTH} characters required`
                : undefined
            }
            autoComplete="off"
            autoFocus
          />

          <label className="flex cursor-pointer items-center gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 accent-accent-gold"
            />
            Remember me
          </label>

          <Button fullWidth onClick={handleSubmit}>
            Enter Game
          </Button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-text-secondary">
          Demo mode • Play responsibly
        </p>
      </div>
    </div>
  )
}
