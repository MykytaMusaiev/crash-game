'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { storage } from '@/shared/lib/storage'
import { socketService } from '@/shared/api/socketService'
import { APP_CONSTANTS } from '@/shared/constants/appConstants'
import { useGameStore } from '@/store/gameStore'

export function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [touched, setTouched] = useState(false)
  const setStoreUsername = useGameStore((s) => s.setUsername)

  const isValid = username.length >= APP_CONSTANTS.MIN_USERNAME_LENGTH
  const showError = touched && !isValid

  function handleSubmit() {
    setTouched(true)
    if (!isValid) return

    // Save the username as an apiKey — it is used in the X-API-Key header
    // and in socket auth. Each tab stores its user separately.
    storage.setApiKey(username)
    setStoreUsername(username)

    // Connect the socket immediately upon login.
    // useInitApp in GameLayout will also call connect — but it is idempotent,
    // so calling again won't break anything.
    socketService.connect(username)

    router.push('/game')
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
            error={showError ? `Minimum ${APP_CONSTANTS.MIN_USERNAME_LENGTH} characters required` : undefined}
            autoComplete="off"
            autoFocus
          />
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