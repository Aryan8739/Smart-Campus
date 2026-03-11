import { useState } from 'react'
import { NavLink } from 'react-router-dom'

interface SidebarGroupProps {
  title: string
  items: Array<{ label: string; to: string }>
}

function SidebarGroup({ title, items }: SidebarGroupProps) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div>
      <button
        onClick={() => setIsOpen((previous) => !previous)}
        className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-left text-xs font-semibold uppercase tracking-[0.24em] text-white/70"
      >
        <span>{title}</span>
        <span className={`transition-transform ${isOpen ? 'rotate-0' : '-rotate-90'}`}>⌄</span>
      </button>
      {isOpen ? (
        <div className="mt-2 space-y-2">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex rounded-[1rem] px-4 py-3 text-[0.98rem] font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-white/14 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                    : 'text-white/72 hover:translate-x-1 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default SidebarGroup
