function Badge({
  label,
  tone = 'neutral',
}: {
  label: string
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info'
}) {
  const styles = {
    neutral: {
      className: 'border shadow-[0_1px_2px_rgba(15,23,42,0.08)]',
      style: {
        borderColor: '#cbd5e1',
        backgroundColor: '#f8fafc',
        color: '#334155',
      },
    },
    success: {
      className: 'border shadow-[0_1px_2px_rgba(16,185,129,0.12)]',
      style: {
        borderColor: '#a7f3d0',
        backgroundColor: '#ecfdf5',
        color: '#166534',
      },
    },
    warning: {
      className: 'border shadow-[0_1px_2px_rgba(245,158,11,0.12)]',
      style: {
        borderColor: '#fcd34d',
        backgroundColor: '#fffbeb',
        color: '#92400e',
      },
    },
    danger: {
      className: 'border shadow-[0_1px_2px_rgba(244,63,94,0.12)]',
      style: {
        borderColor: '#fecdd3',
        backgroundColor: '#fff1f2',
        color: '#9f1239',
      },
    },
    info: {
      className: 'border shadow-[0_1px_2px_rgba(59,130,246,0.12)]',
      style: {
        borderColor: '#bfdbfe',
        backgroundColor: '#eff6ff',
        color: '#1d4ed8',
      },
    },
  }

  const currentStyle = styles[tone]

  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-full px-3 py-1 text-[13px] font-semibold leading-none tracking-[0.01em] whitespace-nowrap ${currentStyle.className}`}
      style={{ ...currentStyle.style, textShadow: 'none', opacity: 1, WebkitTextFillColor: currentStyle.style.color }}
    >
      {label}
    </span>
  )
}

export default Badge
