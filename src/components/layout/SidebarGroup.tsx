import { NavLink } from 'react-router-dom'

interface SidebarGroupProps {
  title: string
  items: Array<{ label: string; to: string }>
  isOpen: boolean
  onToggle: () => void
  onItemSelect?: () => void
}

function SidebarGroup({ title, items, isOpen, onToggle, onItemSelect }: SidebarGroupProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300"
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
              onClick={onItemSelect}
              className={({ isActive }) =>
                `flex rounded-[0.9rem] px-3.5 py-2.5 text-[0.9rem] font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-[rgba(49,87,163,0.12)] text-[#1f3560] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] dark:bg-slate-800 dark:text-slate-100 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
                    : 'text-slate-600 hover:translate-x-1 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
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
