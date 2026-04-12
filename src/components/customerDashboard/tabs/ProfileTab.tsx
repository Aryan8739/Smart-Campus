type ProfileTabProps = {
  profile: {
    name: string
    email: string
    role: string
    department: string
  }
}

function ProfileTab({ profile }: ProfileTabProps) {
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
    </section>
  )
}

export default ProfileTab
