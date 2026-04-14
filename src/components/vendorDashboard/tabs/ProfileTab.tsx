type VendorProfile = {
  managerName: string
  companyName: string
  email: string
  phone: string
  operatingZones: string
}

type ProfileTabProps = {
  profile: VendorProfile
  settlementAlerts: boolean
  slaAlerts: boolean
  message: string
  onProfileChange: (next: VendorProfile) => void
  onSettlementAlertsChange: (value: boolean) => void
  onSlaAlertsChange: (value: boolean) => void
  onSave: () => void
  onReset: () => void
}

function ProfileTab({
  profile,
  settlementAlerts,
  slaAlerts,
  message,
  onProfileChange,
  onSettlementAlertsChange,
  onSlaAlertsChange,
  onSave,
  onReset,
}: ProfileTabProps) {
  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Vendor Profile</h2>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Manage account details, contact channels, and operational preferences.
        </p>
      </header>

      <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
        <div className="mb-3 grid gap-2 sm:grid-cols-3">
          <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3 text-xs text-[rgb(var(--color-text-secondary))]">
            Alert Coverage: <span className="font-semibold text-[rgb(var(--color-text-primary))]">{settlementAlerts || slaAlerts ? 'Enabled' : 'Disabled'}</span>
          </div>
          <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3 text-xs text-[rgb(var(--color-text-secondary))]">
            Contact Channel: <span className="font-semibold text-[rgb(var(--color-text-primary))]">Email + Phone</span>
          </div>
          <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3 text-xs text-[rgb(var(--color-text-secondary))]">
            Account State: <span className="font-semibold text-[rgb(var(--color-success))]">Active</span>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">
              Manager Name
            </label>
            <input
              value={profile.managerName}
              onChange={(event) => onProfileChange({ ...profile, managerName: event.target.value })}
              className="mt-1 w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">
              Company Name
            </label>
            <input
              value={profile.companyName}
              onChange={(event) => onProfileChange({ ...profile, companyName: event.target.value })}
              className="mt-1 w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">
              Email
            </label>
            <input
              value={profile.email}
              onChange={(event) => onProfileChange({ ...profile, email: event.target.value })}
              className="mt-1 w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">
              Phone
            </label>
            <input
              value={profile.phone}
              onChange={(event) => onProfileChange({ ...profile, phone: event.target.value })}
              className="mt-1 w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">
            Operating Zones
          </label>
          <input
            value={profile.operatingZones}
            onChange={(event) => onProfileChange({ ...profile, operatingZones: event.target.value })}
            className="mt-1 w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm"
          />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex items-center justify-between rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm">
            <span>Settlement alerts</span>
            <input
              type="checkbox"
              checked={settlementAlerts}
              onChange={(event) => onSettlementAlertsChange(event.target.checked)}
              className="h-4 w-4 accent-[rgb(var(--color-primary))]"
            />
          </label>
          <label className="flex items-center justify-between rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm">
            <span>SLA risk alerts</span>
            <input
              type="checkbox"
              checked={slaAlerts}
              onChange={(event) => onSlaAlertsChange(event.target.checked)}
              className="h-4 w-4 accent-[rgb(var(--color-primary))]"
            />
          </label>
        </div>

        {message ? <p className="mt-3 text-xs font-semibold text-[rgb(var(--color-success))]">{message}</p> : null}

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onSave}
            className="rounded-lg bg-[rgb(var(--color-primary))] px-4 py-2 text-xs font-semibold text-white"
          >
            Save Profile Settings
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-4 py-2 text-xs font-semibold"
          >
            Reset Changes
          </button>
        </div>
      </article>
    </section>
  )
}

export default ProfileTab
