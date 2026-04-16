import type { ManagedUser } from '../types'

export interface UserAuditEntry {
  id: string
  action: string
  timestamp: string
  outcome: 'Success' | 'Warning' | 'Blocked'
}

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function nowLabel() {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
}

export async function fetchUserAuditLogs(user: ManagedUser): Promise<UserAuditEntry[]> {
  await delay(450)

  return [
    {
      id: `${user.id}-AUD-1`,
      action: 'Account profile reviewed by admin',
      timestamp: nowLabel(),
      outcome: 'Success',
    },
    {
      id: `${user.id}-AUD-2`,
      action: `Role validation for ${user.role}`,
      timestamp: user.createdDate,
      outcome: 'Warning',
    },
    {
      id: `${user.id}-AUD-3`,
      action: user.mfaEnabled ? 'MFA compliance confirmed' : 'MFA disabled warning recorded',
      timestamp: user.lastLogin,
      outcome: user.mfaEnabled ? 'Success' : 'Warning',
    },
  ]
}

export async function impersonateUser(user: ManagedUser): Promise<string> {
  await delay(700)

  if (user.status !== 'Active') {
    throw new Error('Only active users can be impersonated.')
  }

  return `Impersonation session started for ${user.name}.`
}
