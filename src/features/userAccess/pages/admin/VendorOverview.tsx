import DataPanel from '../../components/common/DataPanel'
import { useAdminModule } from '../../hooks/useAdminModule'

function VendorOverview() {
  const { vendors } = useAdminModule()

  return (
    <section>
      <DataPanel title="Vendor Overview">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="rounded-[1.1rem] bg-slate-50 p-4">
              <p className="font-semibold text-slate-800">{vendor.name}</p>
              <p className="mt-1 text-sm text-slate-500">{vendor.category}</p>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                <span>{vendor.activeTickets} active tickets</span>
                <span>{vendor.slaScore}% SLA</span>
              </div>
            </div>
          ))}
        </div>
      </DataPanel>
    </section>
  )
}

export default VendorOverview
