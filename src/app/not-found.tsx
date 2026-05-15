import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-primary px-4">
      <section className="w-full max-w-sm rounded-xl border border-border bg-bg-panel p-8 text-center">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-secondary text-2xl">
            📈
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-accent-gold">
              404
            </p>

            <h1 className="text-2xl font-bold">
              <span className="text-accent-gold">Page</span>
              <span className="text-text-primary"> Not Found</span>
            </h1>

            <p className="mt-2 text-sm leading-6 text-text-secondary">
              This route does not exist or the game session is no longer
              available.
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="flex h-11 w-full items-center justify-center rounded-md bg-accent-gold px-4 text-sm font-semibold text-bg-primary transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-panel"
        >
          Back to Login
        </Link>

        <p className="mt-6 text-xs text-text-secondary">
          Demo mode • Play responsibly
        </p>
      </section>
    </main>
  )
}