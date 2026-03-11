import DataPanel from '../../components/common/DataPanel'
import { usePermissions } from '../../hooks/usePermissions'
import { useAdminModule } from '../../hooks/useAdminModule'

function Reports() {
  const { reports } = useAdminModule()
  const { can } = usePermissions()

  return (
    <section>
      <DataPanel title="Reports" action={can('REPORTS_VIEW') ? <button className="rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-semibold text-white">Generate Report</button> : null}>
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="flex items-center justify-between rounded-[1.1rem] bg-slate-50 px-4 py-4">
              <div>
                <p className="font-semibold text-slate-800">{report.name}</p>
                <p className="text-sm text-slate-500">{report.category} • {report.generatedOn}</p>
              </div>
              <span className="text-sm font-medium text-slate-500">{report.owner}</span>
            </div>
          ))}
        </div>
      </DataPanel>
    </section>
  )
}

export default Reports
