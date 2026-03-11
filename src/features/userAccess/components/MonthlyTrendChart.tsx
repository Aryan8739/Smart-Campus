function MonthlyTrendChart() {
  return (
    <svg viewBox="0 0 540 255" className="h-[270px] w-full">
      {[0, 1, 2, 3, 4].map((line) => (
        <line
          key={line}
          x1="36"
          y1={28 + line * 47}
          x2="500"
          y2={28 + line * 47}
          stroke="rgba(148,163,184,0.22)"
        />
      ))}
      {[0, 1, 2, 3, 4, 5].map((line) => (
        <line
          key={`v-${line}`}
          x1={70 + line * 70}
          y1="18"
          x2={70 + line * 70}
          y2="222"
          stroke="rgba(148,163,184,0.16)"
          strokeDasharray="4 6"
        />
      ))}
      <polyline
        fill="none"
        stroke="rgb(var(--color-primary))"
        strokeWidth="3"
        points="70,170 140,156 210,143 280,157 350,149 420,126 490,132"
      />
      <polyline
        fill="none"
        stroke="rgb(var(--color-accent))"
        strokeWidth="3"
        points="70,198 140,188 210,181 280,190 350,177 420,169 490,178"
      />
      {[
        [70, 170],
        [140, 156],
        [210, 143],
        [280, 157],
        [350, 149],
        [420, 126],
        [490, 132],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="4.5" fill="rgb(var(--color-primary))" />
      ))}
      {[
        [70, 198],
        [140, 188],
        [210, 181],
        [280, 190],
        [350, 177],
        [420, 169],
        [490, 178],
      ].map(([x, y]) => (
        <circle
          key={`g-${x}-${y}`}
          cx={x}
          cy={y}
          r="4.5"
          fill="white"
          stroke="rgb(var(--color-accent))"
          strokeWidth="2.5"
        />
      ))}
    </svg>
  )
}

export default MonthlyTrendChart
