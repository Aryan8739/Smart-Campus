import { useState } from 'react'
import Badge from '../../components/common/Badge'
import DataPanel from '../../components/common/DataPanel'
import { useAdminModule } from '../../features/userAccess/hooks/useAdminModule'
import { usePermissions } from '../../features/userAccess/hooks/usePermissions'

function SystemSettings() {
  const { automation } = useAdminModule()
  const { can } = usePermissions()
  const [settings, setSettings] = useState(automation)

  const toggle = (key: keyof typeof settings) => {
    setSettings((previous) => ({ ...previous, [key]: !previous[key] }))
  }

  return (
    <section>
      <DataPanel
        title="System Settings"
        action={
          can('SYSTEM_SETTINGS_EDIT') ? (
            <button className="rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-semibold text-white">
              Save Changes
            </button>
          ) : (
            <Badge label="Read Only" tone="warning" />
          )
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['autoSuspendInactiveUsers', 'Auto suspend after 90 days inactivity'],
            ['autoLockAfterFailedAttempts', 'Auto lock account after 5 failed login attempts'],
            ['credentialExpiryAlerts', 'Credential expiry alert system'],
            ['autoForceLogoutHighRisk', 'Auto force logout on high-risk login'],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center justify-between rounded-[1.1rem] bg-slate-50 px-4 py-4">
              <div>
                <p className="font-semibold text-slate-800">{label}</p>
                <p className="mt-1 text-sm text-slate-500">Automation rule available campus-wide.</p>
              </div>
              <button
                disabled={!can('SYSTEM_SETTINGS_EDIT')}
                onClick={() => toggle(key as keyof typeof settings)}
                className={`relative h-7 w-12 rounded-full transition ${settings[key as keyof typeof settings] ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${settings[key as keyof typeof settings] ? 'left-6' : 'left-1'}`} />
              </button>
            </label>
          ))}
        </div>
      </DataPanel>
    </section>
  )
}

export default SystemSettings
