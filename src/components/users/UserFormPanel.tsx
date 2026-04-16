import { useState, type Dispatch, type SetStateAction } from 'react'
import DataPanel from '../common/DataPanel'
import { useAdminModule } from '../../features/userAccess/hooks/useAdminModule'
import type { ManagedUser } from '../../features/userAccess/types'

function randomIndex(max: number) {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const values = new Uint32Array(1)
    crypto.getRandomValues(values)
    return values[0] % max
  }

  return Math.floor(Math.random() * max)
}

function generateTemporaryPassword() {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const lowercase = 'abcdefghijkmnopqrstuvwxyz'
  const digits = '23456789'
  const symbols = '@#$%*!?'
  const all = `${uppercase}${lowercase}${digits}${symbols}`

  const chars = [
    uppercase[randomIndex(uppercase.length)],
    lowercase[randomIndex(lowercase.length)],
    digits[randomIndex(digits.length)],
    symbols[randomIndex(symbols.length)],
  ]

  while (chars.length < 10) {
    chars.push(all[randomIndex(all.length)])
  }

  for (let index = chars.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(index + 1)
    const current = chars[index]
    chars[index] = chars[swapIndex]
    chars[swapIndex] = current
  }

  return `C360-${chars.join('')}`
}

function formatDateLabel(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function nextUserId(users: ManagedUser[]) {
  const maxId = users.reduce((highest, user) => {
    const match = /^USR-(\d+)$/.exec(user.id)
    const numericPart = match ? Number(match[1]) : 0
    return Math.max(highest, numericPart)
  }, 1000)

  return `USR-${String(maxId + 1).padStart(4, '0')}`
}

function UserFormPanel() {
  const { users, setUsers } = useAdminModule()
  const [sendInvite, setSendInvite] = useState(true)
  const [mfaEnabled, setMfaEnabled] = useState(true)
  const [approvalRequired, setApprovalRequired] = useState(true)
  const [temporaryPassword, setTemporaryPassword] = useState('CAMPUS360#2026')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: 'IT Support',
    campus: 'Campus' as ManagedUser['campus'],
    role: 'SUPER_ADMIN',
    status: 'Active' as ManagedUser['status'],
    expiryDate: '',
  })
  const fieldClassName =
    'w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[rgb(var(--color-primary))]'

  const handleGeneratePassword = () => {
    setTemporaryPassword(generateTemporaryPassword())
  }

  const handleAddUser = () => {
    const fullName = form.fullName.trim()
    const email = form.email.trim().toLowerCase()
    const phone = form.phone.trim()

    if (!fullName || !email || !phone) {
      setFeedback('Please fill Full Name, Email and Phone before adding a user.')
      return
    }

    const duplicateEmail = users.some((user) => user.email.toLowerCase() === email)
    if (duplicateEmail) {
      setFeedback('A user with this email already exists.')
      return
    }

    const createdDate = formatDateLabel(new Date())
    const expiryDate = form.expiryDate
      ? formatDateLabel(new Date(form.expiryDate))
      : '31 Dec 2026'
    const approval = approvalRequired ? 'Pending' : 'Approved'
    const status: ManagedUser['status'] = approvalRequired && form.status === 'Active'
      ? 'Pending Approval'
      : form.status

    const nextUser: ManagedUser = {
      id: nextUserId(users),
      name: fullName,
      email,
      phone,
      role: form.role,
      department: form.department,
      campus: form.campus,
      status,
      approval,
      mfaEnabled,
      lastLogin: sendInvite ? 'Invite sent, awaiting first login' : 'No session yet',
      loginAttempts: 0,
      sessionStatus: 'Offline',
      createdDate,
      riskScore: 12,
      failedLoginsToday: 0,
      inactiveDays: 0,
      expiryDate,
    }

    setUsers((previous) => [nextUser, ...previous])
    setFeedback(`User ${nextUser.name} added successfully.`)
    setTemporaryPassword(generateTemporaryPassword())
    setForm((previous) => ({
      ...previous,
      fullName: '',
      email: '',
      phone: '',
      expiryDate: '',
      status: 'Active',
    }))
  }

  const updateField = <T extends keyof typeof form>(key: T, value: typeof form[T]) => {
    setForm((previous) => ({ ...previous, [key]: value }))
  }

  return (
    <DataPanel
      title="Add User"
      action={
        <button
          type="button"
          onClick={handleGeneratePassword}
          className="rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-semibold text-white"
        >
          Generate Password
        </button>
      }
    >
      {feedback ? (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          {feedback}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <label className="text-sm text-[var(--text-secondary)]">
          <span className="mb-2 block font-medium">Full Name</span>
          <input
            className={fieldClassName}
            placeholder="Aarav Sharma"
            value={form.fullName}
            onChange={(event) => updateField('fullName', event.target.value)}
          />
        </label>
        <label className="text-sm text-[var(--text-secondary)]">
          <span className="mb-2 block font-medium">Email</span>
          <input
            type="email"
            className={fieldClassName}
            placeholder="aarav.sharma@gbu.ac.in"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
          />
        </label>
        <label className="text-sm text-[var(--text-secondary)]">
          <span className="mb-2 block font-medium">Phone</span>
          <input
            className={fieldClassName}
            placeholder="+91 98XXXXXX12"
            value={form.phone}
            onChange={(event) => updateField('phone', event.target.value)}
          />
        </label>
        <label className="text-sm text-[var(--text-secondary)]">
          <span className="mb-2 block font-medium">Department</span>
          <select
            className={fieldClassName}
            value={form.department}
            onChange={(event) => updateField('department', event.target.value)}
          >
            <option>IT Support</option>
            <option>Security Office</option>
            <option>Campus Operations</option>
          </select>
        </label>
        <label className="text-sm text-[var(--text-secondary)]">
          <span className="mb-2 block font-medium">Campus</span>
          <select
            className={fieldClassName}
            value={form.campus}
            onChange={(event) => updateField('campus', event.target.value as ManagedUser['campus'])}
          >
            <option>Campus</option>
            <option>North Campus</option>
            <option>Research Park</option>
          </select>
        </label>
        <label className="text-sm text-[var(--text-secondary)]">
          <span className="mb-2 block font-medium">Role</span>
          <select
            className={fieldClassName}
            value={form.role}
            onChange={(event) => updateField('role', event.target.value)}
          >
            <option>SUPER_ADMIN</option>
            <option>User</option>
            <option>Technician</option>
            <option>Vendor</option>
          </select>
        </label>
        <label className="text-sm text-[var(--text-secondary)]">
          <span className="mb-2 block font-medium">Temporary Password</span>
          <input className={fieldClassName} value={temporaryPassword} readOnly />
        </label>
        <label className="text-sm text-[var(--text-secondary)]">
          <span className="mb-2 block font-medium">Account Expiry</span>
          <input
            type="date"
            className={fieldClassName}
            value={form.expiryDate}
            onChange={(event) => updateField('expiryDate', event.target.value)}
          />
        </label>
        <label className="text-sm text-[var(--text-secondary)]">
          <span className="mb-2 block font-medium">Status</span>
          <select
            className={fieldClassName}
            value={form.status}
            onChange={(event) => updateField('status', event.target.value as ManagedUser['status'])}
          >
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

      <div className="mt-5 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            setFeedback(null)
            setForm((previous) => ({
              ...previous,
              fullName: '',
              email: '',
              phone: '',
              expiryDate: '',
              status: 'Active',
            }))
          }}
          className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={handleAddUser}
          className="rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-semibold text-white"
        >
          Add User
        </button>
      </div>
    </DataPanel>
  )
}

export default UserFormPanel
