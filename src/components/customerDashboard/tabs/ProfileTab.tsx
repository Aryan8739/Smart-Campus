type ProfileTabProps = {
  profile: {
    name: string
    email: string
    role: string
    department: string
  }
  phone: string
  hostelAddress: string
  emailAlerts: boolean
  whatsappAlerts: boolean
  message: string
  onPhoneChange: (value: string) => void
  onHostelAddressChange: (value: string) => void
  onEmailAlertsChange: (value: boolean) => void
  onWhatsappAlertsChange: (value: boolean) => void
  onSave: () => void
}

function ProfileTab({
  profile,
  phone,
  hostelAddress,
  emailAlerts,
  whatsappAlerts,
  message,
  onPhoneChange,
  onHostelAddressChange,
  onEmailAlertsChange,
  onWhatsappAlertsChange,
  onSave,
}: ProfileTabProps) {
  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
        <h2 className="text-xl font-semibold">My Profile</h2>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Account identity, role scope, and service interaction summary.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Full Name</p>
          <p className="mt-1 text-lg font-semibold text-[rgb(var(--color-text-primary))]">{profile.name}</p>

          <p className="mt-4 text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Email</p>
          <p className="mt-1 text-sm text-[rgb(var(--color-text-primary))]">{profile.email}</p>

          <p className="mt-4 text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Department</p>
          <p className="mt-1 text-sm text-[rgb(var(--color-text-primary))]">{profile.department}</p>
        </article>

        <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Role</p>
          <p className="mt-1 text-lg font-semibold text-[rgb(var(--color-primary))]">{profile.role}</p>

          <div className="mt-4 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-4 text-sm text-[rgb(var(--color-text-secondary))]">
            <p className="font-semibold text-[rgb(var(--color-text-primary))]">What you can do</p>
            <ul className="mt-2 space-y-1 text-xs">
              <li>• Raise and monitor complaints end-to-end</li>
              <li>• Attach evidence and request reopen for unresolved quality</li>
              <li>• Review billing summary and submit feedback</li>
            </ul>
          </div>
        </article>
      </div>

      <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Contact & Notification Preferences</h3>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">
              Mobile Number
            </label>
            <input
              value={phone}
              onChange={(event) => onPhoneChange(event.target.value)}
              className="mt-1 w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">
              Hostel / Office Address
            </label>
            <input
              value={hostelAddress}
              onChange={(event) => onHostelAddressChange(event.target.value)}
              className="mt-1 w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm">
            <span>Email alerts</span>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(event) => onEmailAlertsChange(event.target.checked)}
              className="h-4 w-4 accent-[rgb(var(--color-primary))]"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm">
            <span>WhatsApp alerts</span>
            <input
              type="checkbox"
              checked={whatsappAlerts}
              onChange={(event) => onWhatsappAlertsChange(event.target.checked)}
              className="h-4 w-4 accent-[rgb(var(--color-primary))]"
            />
          </label>
        </div>

        {message ? <p className="mt-3 text-xs font-semibold text-[rgb(var(--color-success))]">{message}</p> : null}

        <button
          type="button"
          onClick={onSave}
          className="mt-4 rounded-lg bg-[rgb(var(--color-primary))] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[rgb(var(--color-primary-hover))]"
        >
          Save Preferences
        </button>
      </article>
    </section>
  )
}

export default ProfileTab
