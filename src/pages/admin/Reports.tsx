import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import DataPanel from '../../components/common/DataPanel'
import { usePermissions } from '../../features/userAccess/hooks/usePermissions'
import { useAdminModule } from '../../features/userAccess/hooks/useAdminModule'
import type { ReportRecord } from '../../features/userAccess/types'

type ReportForm = {
  name: string
  category: ReportRecord['category']
  owner: string
  dateRange: '7d' | '30d' | '90d'
}

const defaultForm: ReportForm = {
  name: '',
  category: 'Security',
  owner: 'Super Admin',
  dateRange: '30d',
}

function Reports() {
  const { reports } = useAdminModule()
  const { can } = usePermissions()
  const [reportItems, setReportItems] = useState(reports)
  const [isGenerateOpen, setIsGenerateOpen] = useState(false)
  const [form, setForm] = useState<ReportForm>(defaultForm)
  const [errors, setErrors] = useState<Partial<Record<keyof ReportForm, string>>>({})
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    setReportItems(reports)
  }, [reports])

  useEffect(() => {
    if (!feedback) return undefined
    const timer = window.setTimeout(() => setFeedback(null), 3200)
    return () => window.clearTimeout(timer)
  }, [feedback])

  const openGenerateModal = () => {
    setForm(defaultForm)
    setErrors({})
    setIsGenerateOpen(true)
  }

  const handleGenerateReport = () => {
    const nextErrors: Partial<Record<keyof ReportForm, string>> = {}
    if (!form.name.trim()) nextErrors.name = 'Report name is required.'
    if (!form.owner.trim()) nextErrors.owner = 'Owner is required.'
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length) return

    const generatedOn = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date())

    const nextReport: ReportRecord = {
      id: `REP-${Date.now()}`,
      name: form.name.trim(),
      category: form.category,
      generatedOn,
      owner: form.owner.trim(),
    }

    setReportItems((previous) => [nextReport, ...previous])
    setFeedback(`${nextReport.name} generated successfully for the last ${form.dateRange}.`)
    setIsGenerateOpen(false)
  }

  return (
    <section>
      <DataPanel
        title="Reports"
        action={
          can('REPORTS_VIEW') ? (
            <button
              onClick={openGenerateModal}
              className="rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-semibold text-white"
            >
              Generate Report
            </button>
          ) : null
        }
      >
        {feedback ? (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {feedback}
          </div>
        ) : null}

        <div className="space-y-3">
          {reportItems.map((report) => (
            <div key={report.id} className="flex items-center justify-between rounded-[1.1rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-4 shadow-sm">
              <div>
                <p className="font-semibold text-[var(--text-primary)]">{report.name}</p>
                <p className="text-sm text-[var(--text-secondary)]">{report.category} • {report.generatedOn}</p>
              </div>
              <span className="text-sm font-medium text-[var(--text-secondary)]">{report.owner}</span>
            </div>
          ))}
        </div>
      </DataPanel>

      {isGenerateOpen ? createPortal(
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/35 px-4">
          <div className="w-full max-w-2xl rounded-[1.6rem] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">Generate Report</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Create a new report package for compliance, security, or operations review.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="text-sm text-[var(--text-secondary)] md:col-span-2">
                <span className="mb-2 block font-medium text-[var(--text-primary)]">Report Name</span>
                <input
                  value={form.name}
                  onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none"
                />
                {errors.name ? <span className="mt-1 block text-xs text-rose-600">{errors.name}</span> : null}
              </label>

              <label className="text-sm text-[var(--text-secondary)]">
                <span className="mb-2 block font-medium text-[var(--text-primary)]">Category</span>
                <select
                  value={form.category}
                  onChange={(event) => setForm((previous) => ({ ...previous, category: event.target.value as ReportForm['category'] }))}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none"
                >
                  <option value="Security">Security</option>
                  <option value="Operations">Operations</option>
                  <option value="Compliance">Compliance</option>
                </select>
              </label>

              <label className="text-sm text-[var(--text-secondary)]">
                <span className="mb-2 block font-medium text-[var(--text-primary)]">Date Range</span>
                <select
                  value={form.dateRange}
                  onChange={(event) => setForm((previous) => ({ ...previous, dateRange: event.target.value as ReportForm['dateRange'] }))}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </label>

              <label className="text-sm text-[var(--text-secondary)] md:col-span-2">
                <span className="mb-2 block font-medium text-[var(--text-primary)]">Owner</span>
                <input
                  value={form.owner}
                  onChange={(event) => setForm((previous) => ({ ...previous, owner: event.target.value }))}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none"
                />
                {errors.owner ? <span className="mt-1 block text-xs text-rose-600">{errors.owner}</span> : null}
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsGenerateOpen(false)}
                className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateReport}
                className="rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-semibold text-white"
              >
                Generate
              </button>
            </div>
          </div>
        </div>,
        document.body
      ) : null}
    </section>
  )
}

export default Reports
