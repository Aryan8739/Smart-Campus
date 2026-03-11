import ComplaintStatusChart from '../../components/ComplaintStatusChart'
import MonthlyTrendChart from '../../components/MonthlyTrendChart'
import DataPanel from '../../components/common/DataPanel'
import { useAdminModule } from '../../hooks/useAdminModule'

function ComplaintMonitoring() {
  const { complaints } = useAdminModule()

  return (
    <>
      <section className="grid gap-7 xl:grid-cols-[1.06fr_1fr]">
        <DataPanel title="Complaint Status Distribution">
          <ComplaintStatusChart />
        </DataPanel>
        <DataPanel title="Complaint Trend">
          <MonthlyTrendChart />
        </DataPanel>
      </section>
      <section>
        <DataPanel title="Complaint Queue">
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.18em] text-slate-500">
                  <th className="px-4">Ticket</th>
                  <th className="px-4">Campus</th>
                  <th className="px-4">Department</th>
                  <th className="px-4">Priority</th>
                  <th className="px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint.id} className="bg-slate-50 text-sm">
                    <td className="rounded-l-2xl px-4 py-4 font-semibold text-slate-800">{complaint.id}</td>
                    <td className="px-4 py-4 text-slate-500">{complaint.campus}</td>
                    <td className="px-4 py-4 text-slate-500">{complaint.department}</td>
                    <td className="px-4 py-4 text-slate-500">{complaint.priority}</td>
                    <td className="rounded-r-2xl px-4 py-4 text-slate-500">{complaint.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DataPanel>
      </section>
    </>
  )
}

export default ComplaintMonitoring
