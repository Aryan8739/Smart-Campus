function VendorInsightsPanel({
  smartInsights,
  topPerformers,
  lowPerformers,
}: {
  smartInsights: string[]
  topPerformers: string[]
  lowPerformers: string[]
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.9fr_0.9fr]">
      <section className="rounded-[1.2rem] border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm">
        <p className="text-sm font-semibold text-[var(--text-primary)]">Smart Insights</p>
        <div className="mt-4 space-y-3">
          {smartInsights.map((insight) => (
            <div key={insight} className="rounded-xl bg-[var(--bg-primary)] p-3 text-sm text-[var(--text-secondary)]">
              {insight}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[1.2rem] border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm">
        <p className="text-sm font-semibold text-[var(--text-primary)]">Top Performing Vendors</p>
        <div className="mt-4 space-y-3">
          {topPerformers.map((vendor, index) => (
            <div key={vendor} className="flex items-center justify-between rounded-xl bg-[var(--bg-primary)] px-3 py-3 text-sm">
              <span className="font-medium text-[var(--text-primary)]">{vendor}</span>
              <span className="text-[var(--text-secondary)]">#{index + 1}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[1.2rem] border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm">
        <p className="text-sm font-semibold text-[var(--text-primary)]">Low Performing Vendors</p>
        <div className="mt-4 space-y-3">
          {lowPerformers.map((vendor, index) => (
            <div key={vendor} className="flex items-center justify-between rounded-xl bg-[var(--bg-primary)] px-3 py-3 text-sm">
              <span className="font-medium text-[var(--text-primary)]">{vendor}</span>
              <span className="text-[var(--text-secondary)]">#{index + 1}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default VendorInsightsPanel
