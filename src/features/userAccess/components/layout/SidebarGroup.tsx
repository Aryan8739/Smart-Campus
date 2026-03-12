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
        className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70"
      >
        <span>{title}</span>
        <span className={`transition-transform ${isOpen ? 'rotate-0' : '-rotate-90'}`}>⌄</span>
      </button>
      {isOpen ? (
        <div className="mt-1.5 space-y-1.5">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex rounded-[0.9rem] px-3.5 py-2.5 text-[0.9rem] font-medium transition-all duration-300 ${
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
