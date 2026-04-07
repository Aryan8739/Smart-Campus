const steps = ['Registration', 'Role Mapping', 'Approval', 'Activation']

function ApprovalWorkflow() {
  return (
    <div className="rounded-[1.1rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4">
      <p className="text-sm font-semibold text-[var(--text-primary)]">Approval Workflow</p>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        {steps.map((step, index) => (
          <div
            key={step}
            className="flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(var(--color-primary))] text-sm font-semibold text-white">
              {index + 1}
            </div>
            <span className="text-sm font-medium text-[var(--text-primary)]">{step}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ApprovalWorkflow
