function App() {
  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <section className="mx-auto max-w-3xl rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-primary md:text-4xl">RindaNet VPN</h1>
        <p className="mt-3 text-muted">Tailwind CSS is configured with reusable theme colors.</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-primary p-4 text-white">Primary</div>
          <div className="rounded-lg bg-secondary p-4 text-white">Secondary</div>
          <div className="rounded-lg bg-accent p-4 text-white">Accent</div>
          <div className="rounded-lg border border-border bg-background p-4 text-text">Surface / Border</div>
        </div>
      </section>
    </main>
  )
}

export default App
