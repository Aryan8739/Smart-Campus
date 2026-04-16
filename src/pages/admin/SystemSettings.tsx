import { useEffect, useState } from 'react'
import Badge from '../../components/common/Badge'
import DataPanel from '../../components/common/DataPanel'
import { useAdminModule } from '../../features/userAccess/hooks/useAdminModule'
import { usePermissions } from '../../features/userAccess/hooks/usePermissions'
import { saveAutomationSettings } from '../../features/userAccess/services/settingsService'

function SystemSettings() {
  const { automation, setAutomation } = useAdminModule()
  const { can } = usePermissions()
  const [settings, setSettings] = useState(automation)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setSettings(automation)
  }, [automation])

  const toggle = (key: keyof typeof settings) => {
    setSettings((previous) => ({ ...previous, [key]: !previous[key] }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setFeedback(null)
    setError(null)

    try {
      const persisted = await saveAutomationSettings(settings)
      setAutomation(persisted)
      setFeedback('System settings saved successfully.')
    } catch {
      setError('Could not save settings. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section>
      <DataPanel
        title="System Settings"
        action={
          can('SYSTEM_SETTINGS_EDIT') ? (
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          ) : (
            <Badge label="Read Only" tone="warning" />
          )
        }
      >
        {feedback ? (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {feedback}
          </div>
        ) : null}
        {error ? (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['autoSuspendInactiveUsers', 'Auto suspend after 90 days inactivity'],
            ['autoLockAfterFailedAttempts', 'Auto lock account after 5 failed login attempts'],
            ['credentialExpiryAlerts', 'Credential expiry alert system'],
            ['autoForceLogoutHighRisk', 'Auto force logout on high-risk login'],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center justify-between rounded-[1.1rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-4 shadow-sm">
              <div>
                <p className="font-semibold text-[var(--text-primary)]">{label}</p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">Automation rule available campus-wide.</p>
              </div>
              <button
                disabled={!can('SYSTEM_SETTINGS_EDIT')}
                onClick={() => toggle(key as keyof typeof settings)}
                className={`relative h-7 w-12 rounded-full transition ${settings[key as keyof typeof settings] ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'} ${!can('SYSTEM_SETTINGS_EDIT') ? 'cursor-not-allowed opacity-60' : ''}`}
              >
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white dark:bg-slate-100 transition ${settings[key as keyof typeof settings] ? 'left-6' : 'left-1'}`} />
              </button>
            </label>
          ))}
        </div>
      </DataPanel>
    </section>
  )
}

export default SystemSettings
