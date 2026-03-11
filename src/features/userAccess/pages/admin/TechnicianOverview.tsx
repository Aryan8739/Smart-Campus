import DataPanel from '../../components/common/DataPanel'
import { useAdminModule } from '../../hooks/useAdminModule'

function TechnicianOverview() {
  const { technicians } = useAdminModule()

  return (
    <section>
      <DataPanel title="Technician Overview">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {technicians.map((technician) => (
            <div key={technician.id} className="rounded-[1.1rem] bg-slate-50 p-4">
              <p className="font-semibold text-slate-800">{technician.name}</p>
              <p className="mt-1 text-sm text-slate-500">{technician.department}</p>
              <div className="mt-4 h-2 rounded-full bg-slate-200">
                <div className="h-2 rounded-full bg-[rgb(var(--color-primary))]" style={{ width: `${technician.completionRate}%` }} />
              </div>
              <p className="mt-3 text-sm text-slate-500">{technician.assignedTasks} assigned tasks</p>
            </div>
          ))}
        </div>
      </DataPanel>
    </section>
  )
}

export default TechnicianOverview
