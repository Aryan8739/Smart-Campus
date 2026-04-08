import { useState, type Dispatch, type SetStateAction } from 'react'
import DataPanel from '../common/DataPanel'

function UserFormPanel() {
  const [sendInvite, setSendInvite] = useState(true)
  const [mfaEnabled, setMfaEnabled] = useState(true)
  const [approvalRequired, setApprovalRequired] = useState(true)
  const fieldClassName =
    'w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[rgb(var(--color-primary))]'

  return (
    <DataPanel
      title="Add User"
      action={
        <button className="rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-semibold text-white">
          Generate Password
        </button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          ['Full Name', 'Aarav Sharma'],
          ['Email', 'aarav.sharma@gbu.ac.in'],
          ['Phone', '+91 98XXXXXX12'],
        ].map(([label, placeholder]) => (
          <label key={label} className="text-sm text-[var(--text-secondary)]">
            <span className="mb-2 block font-medium">{label}</span>
            <input className={fieldClassName} placeholder={placeholder} />
          </label>
        ))}
        <label className="text-sm text-[var(--text-secondary)]">
          <span className="mb-2 block font-medium">Department</span>
          <select className={fieldClassName}>
            <option>Engineering Services</option>
            <option>Security Office</option>
            <option>Campus Operations</option>
          </select>
        </label>
        <label className="text-sm text-[var(--text-secondary)]">
          <span className="mb-2 block font-medium">Campus</span>
          <select className={fieldClassName}>
            <option>Main Campus</option>
            <option>North Campus</option>
            <option>Research Park</option>
          </select>
        </label>
        <label className="text-sm text-[var(--text-secondary)]">
          <span className="mb-2 block font-medium">Role</span>
          <select className={fieldClassName}>
            <option>SUPER_ADMIN</option>
            <option>SECURITY_ADMIN</option>
            <option>OPS_ADMIN</option>
          </select>
        </label>
        <label className="text-sm text-[var(--text-secondary)]">
          <span className="mb-2 block font-medium">Temporary Password</span>
          <input className={fieldClassName} value="CAMPUS360#2026" readOnly />
        </label>
        <label className="text-sm text-[var(--text-secondary)]">
          <span className="mb-2 block font-medium">Account Expiry</span>
          <input type="date" className={fieldClassName} />
        </label>
        <label className="text-sm text-[var(--text-secondary)]">
          <span className="mb-2 block font-medium">Status</span>
          <select className={fieldClassName}>
            <option>Active</option>
            <option>Suspended</option>
            <option>Pending Approval</option>
          </select>
        </label>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {[
          { label: 'Send invite email', checked: sendInvite, setChecked: setSendInvite },
          { label: 'Enable MFA', checked: mfaEnabled, setChecked: setMfaEnabled },
          { label: 'Approval required', checked: approvalRequired, setChecked: setApprovalRequired },
        ].map(({ label, checked, setChecked }) => (
          <label
            key={label}
            className="flex items-center justify-between rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3"
          >
            <span className="text-sm font-medium text-[var(--text-primary)]">{label}</span>
            <button
              type="button"
              onClick={() => (setChecked as Dispatch<SetStateAction<boolean>>)((previous) => !previous)}
              className={`relative h-7 w-12 rounded-full transition ${checked ? 'bg-emerald-500' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${checked ? 'left-6' : 'left-1'}`} />
            </button>
          </label>
        ))}
      </div>
    </DataPanel>
  )
}

export default UserFormPanel
