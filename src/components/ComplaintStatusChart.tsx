function ComplaintStatusChart() {
  const segments = [
    { value: 24, color: '#2c7fb8' },
    { value: 19, color: '#58a9a6' },
    { value: 21, color: '#90d1ca' },
    { value: 17, color: '#b8dbe9' },
    { value: 19, color: '#325c97' },
  ]

  let cumulative = 0
  const radius = 82
  const circumference = 2 * Math.PI * radius

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="flex flex-col items-center justify-center pt-2">
        <div className="relative flex h-[270px] w-[270px] items-center justify-center">
          <svg width="270" height="270" viewBox="0 0 270 270" className="-rotate-90">
            <circle cx="135" cy="135" r={radius} fill="transparent" stroke="rgba(148,163,184,0.18)" strokeWidth="40" />
            {segments.map((segment, index) => {
              const dash = (segment.value / 100) * circumference
              const offset = circumference - (cumulative / 100) * circumference
              cumulative += segment.value
              return (
                <circle
                  key={index}
                  cx="135"
                  cy="135"
                  r={radius}
                  fill="transparent"
                  stroke={segment.color}
                  strokeWidth="40"
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={offset}
                  strokeLinecap="butt"
                />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-[0.72rem] uppercase tracking-[0.38em] text-[var(--text-secondary)]">Status Mix</p>
            <p className="mt-3 text-[2.45rem] font-semibold leading-none tracking-[-0.04em] text-[var(--text-primary)]">
              100%
            </p>
          </div>
        </div>
        <div className="mt-10 flex max-w-[320px] flex-wrap justify-center gap-3 text-xs text-[var(--text-secondary)]">
          <span className="rounded-full bg-[rgba(44,127,184,0.14)] px-4 py-2">New</span>
          <span className="rounded-full bg-[rgba(88,169,166,0.14)] px-4 py-2">In Review</span>
          <span className="rounded-full bg-[rgba(144,209,202,0.16)] px-4 py-2">Assigned</span>
          <span className="rounded-full bg-[rgba(184,219,233,0.28)] px-4 py-2">Resolved</span>
          <span className="rounded-full bg-[rgba(50,92,151,0.14)] px-4 py-2">Escalated</span>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-6 py-6 shadow-sm">
        <div className="mb-7 flex items-center justify-between text-sm">
          <span className="font-semibold text-[var(--text-primary)]">Last Changes</span>
          <span className="text-[var(--text-secondary)]">Past 6 months</span>
        </div>
        <svg viewBox="0 0 430 220" className="h-[205px] w-full">
          {[0, 1, 2, 3, 4].map((line) => (
            <line
              key={line}
              x1="26"
              y1={34 + line * 34}
              x2="392"
              y2={34 + line * 34}
              stroke="rgba(148,163,184,0.22)"
              strokeDasharray="5 5"
            />
          ))}
          {[0, 1, 2, 3, 4, 5].map((line) => (
            <line
              key={`v-${line}`}
              x1={48 + line * 56}
              y1="30"
              x2={48 + line * 56}
              y2="176"
              stroke="rgba(148,163,184,0.14)"
            />
          ))}
          <polyline
            fill="none"
            stroke="rgb(var(--color-primary))"
            strokeWidth="3"
            points="48,144 104,138 160,137 216,123 272,122 328,114"
          />
          <polyline
            fill="none"
            stroke="rgb(var(--color-accent))"
            strokeWidth="3"
            points="48,156 104,151 160,145 216,141 272,140 328,138"
          />
          {[['48', '144'], ['104', '138'], ['160', '137'], ['216', '123'], ['272', '122'], ['328', '114']].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="rgb(var(--color-primary))" />
          ))}
          {[['48', '156'], ['104', '151'], ['160', '145'], ['216', '141'], ['272', '140'], ['328', '138']].map(([x, y]) => (
            <circle key={`a-${x}-${y}`} cx={x} cy={y} r="4" fill="rgb(var(--color-accent))" />
          ))}
        </svg>
      </div>
    </div>
  )
}

export default ComplaintStatusChart
