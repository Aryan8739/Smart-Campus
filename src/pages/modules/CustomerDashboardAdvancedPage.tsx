import { useMemo, useState } from 'react'

type ComplaintStatus = 'Open' | 'In Progress' | 'Resolved'
type SortOrder = 'Newest First' | 'Oldest First'

const statusBadgeClasses: Record<ComplaintStatus, string> = {
  Open: 'border-[rgb(var(--color-danger))] bg-[rgb(var(--color-danger))]/10 text-[rgb(var(--color-danger))]',
  'In Progress':
    'border-[rgb(var(--color-warning))] bg-[rgb(var(--color-warning))]/10 text-[rgb(var(--color-warning))]',
  Resolved:
    'border-[rgb(var(--color-success))] bg-[rgb(var(--color-success))]/10 text-[rgb(var(--color-success))]',
}

const sampleComplaints = [
  {
    id: 'GBU-2026-101',
    title: 'Street light not working near Hostel C',
    category: 'Electrical',
    status: 'Open' as ComplaintStatus,
    updatedAt: 'Today, 9:15 AM',
    updatedAtIso: '2026-03-05T09:15:00+05:30',
  },
  {
    id: 'GBU-2026-089',
    title: 'Water leakage in Academic Block 2',
    category: 'Plumbing',
    status: 'In Progress' as ComplaintStatus,
    updatedAt: 'Today, 8:40 AM',
    updatedAtIso: '2026-03-05T08:40:00+05:30',
  },
  {
    id: 'GBU-2026-044',
    title: 'Classroom fan replacement request',
    category: 'Electrical',
    status: 'Resolved' as ComplaintStatus,
    updatedAt: 'Yesterday, 5:10 PM',
    updatedAtIso: '2026-03-04T17:10:00+05:30',
  },
]

function CustomerDashboardAdvancedPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadError, setUploadError] = useState('')
  const [uploadMessage, setUploadMessage] = useState('')

  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [sortOrder, setSortOrder] = useState<SortOrder>('Newest First')
  const [searchInput, setSearchInput] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')

  const categories = useMemo(
    () => ['All Categories', ...new Set(sampleComplaints.map((item) => item.category))],
    [],
  )

  const statuses = useMemo(
    () => ['All Status', ...new Set(sampleComplaints.map((item) => item.status))],
    [],
  )

  const filteredComplaints = useMemo(() => {
    const base = sampleComplaints.filter((complaint) => {
      const categoryMatched =
        categoryFilter === 'All Categories' || complaint.category === categoryFilter
      const statusMatched = statusFilter === 'All Status' || complaint.status === statusFilter
      const searchMatched =
        appliedSearch.trim() === '' ||
        complaint.id.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        complaint.title.toLowerCase().includes(appliedSearch.toLowerCase())
      return categoryMatched && statusMatched && searchMatched
    })

    const sorted = [...base].sort((a, b) => {
      const aTime = new Date(a.updatedAtIso).getTime()
      const bTime = new Date(b.updatedAtIso).getTime()
      return sortOrder === 'Newest First' ? bTime - aTime : aTime - bTime
    })

    return sorted
  }, [appliedSearch, categoryFilter, statusFilter, sortOrder])

  const handleFileSelection = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return
    }

    const maxSizeBytes = 10 * 1024 * 1024
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'video/mp4']

    const nextFiles: File[] = []
    const invalidFiles: string[] = []

    Array.from(files).forEach((file) => {
      const validType = allowedMimeTypes.includes(file.type)
      const validSize = file.size <= maxSizeBytes
      if (validType && validSize) {
        nextFiles.push(file)
      } else {
        invalidFiles.push(file.name)
      }
    })

    setSelectedFiles((previous) => [...previous, ...nextFiles])

    if (invalidFiles.length > 0) {
      setUploadError(
        `These files were rejected (type/size rule): ${invalidFiles.join(', ')}. Allowed: JPG, PNG, MP4 up to 10MB.`,
      )
    } else {
      setUploadError('')
    }
    setUploadMessage('')
  }

  const removeFile = (fileName: string) => {
    setSelectedFiles((previous) => previous.filter((file) => file.name !== fileName))
    setUploadError('')
    setUploadMessage('')
  }

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      setUploadError('Select at least one valid file before uploading.')
      setUploadMessage('')
      return
    }

    setUploadError('')
    setUploadMessage(`${selectedFiles.length} file(s) ready for upload.`)
  }

  const resetFilters = () => {
    setCategoryFilter('All Categories')
    setStatusFilter('All Status')
    setSortOrder('Newest First')
    setSearchInput('')
    setAppliedSearch('')
  }

  const applySearch = () => {
    setAppliedSearch(searchInput.trim())
  }

  return (
    <main className="px-4 py-8 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
          <h1 className="text-2xl font-bold md:text-3xl">Customer Dashboard Advanced</h1>
          <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
            Features: file upload UI, status badges, complaint filters/search, mobile responsive
            layout, and dark mode support.
          </p>
          <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
            Advanced layer designed to work with Group 2's Basic Customer Dashboard module.
          </p>
        </header>

        <section className="grid gap-6 xl:grid-cols-3">
          <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm xl:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Complaints</h2>
              <span className="text-xs text-[rgb(var(--color-text-secondary))]">
                {filteredComplaints.length} of {sampleComplaints.length}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    applySearch()
                  }
                }}
                placeholder="Search by complaint ID or title"
                className="min-w-[220px] rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-xs"
              />
              <button
                type="button"
                onClick={applySearch}
                className="rounded-lg bg-[rgb(var(--color-primary))] px-3 py-2 text-xs font-medium text-white"
              >
                Search
              </button>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-xs"
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-xs"
              >
                {statuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value as SortOrder)}
                className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-xs"
              >
                <option>Newest First</option>
                <option>Oldest First</option>
              </select>
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-xs font-medium"
              >
                Reset
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-[rgb(var(--color-text-secondary))]">
                        {complaint.id}
                      </p>
                      <span
                        className={[
                          'rounded-full border px-2 py-1 text-xs font-semibold',
                          statusBadgeClasses[complaint.status],
                        ].join(' ')}
                      >
                        {complaint.status}
                      </span>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold">{complaint.title}</h3>
                    <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
                      {complaint.category} • {complaint.updatedAt}
                    </p>
                  </div>
                ))
              ) : (
                <p className="rounded-xl border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3 text-sm text-[rgb(var(--color-text-secondary))]">
                  No complaints found.
                </p>
              )}
            </div>
          </article>

          <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Upload Attachment</h2>
            <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
              JPG, PNG, MP4 up to 10MB
            </p>
            <div className="mt-4 space-y-3">
              <label
                htmlFor="attachment-upload"
                className="block cursor-pointer rounded-xl border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-5 text-center text-sm text-[rgb(var(--color-text-secondary))]"
              >
                Choose file(s)
              </label>
              <input
                id="attachment-upload"
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.mp4"
                onChange={(event) => handleFileSelection(event.target.files)}
                className="hidden"
              />

              {selectedFiles.length > 0 ? (
                <ul className="space-y-2">
                  {selectedFiles.map((file) => (
                    <li
                      key={`${file.name}-${file.size}`}
                      className="flex items-center justify-between gap-2 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-xs"
                    >
                      <span className="truncate">
                        {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(file.name)}
                        className="rounded-md border border-[rgb(var(--color-border))] px-2 py-1"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}

              {uploadError ? (
                <p className="text-xs font-medium text-[rgb(var(--color-danger))]">{uploadError}</p>
              ) : null}
              {uploadMessage ? (
                <p className="text-xs font-medium text-[rgb(var(--color-success))]">{uploadMessage}</p>
              ) : null}

              <button
                type="button"
                onClick={handleUpload}
                className="w-full rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2.5 text-sm font-semibold text-white"
              >
                Upload
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {Object.keys(statusBadgeClasses).map((status) => (
                <span
                  key={status}
                  className={[
                    'inline-flex rounded-full border px-2 py-1 text-xs font-semibold',
                    statusBadgeClasses[status as ComplaintStatus],
                  ].join(' ')}
                >
                  {status}
                </span>
              ))}
            </div>
            <div className="mt-4 space-y-1 text-xs text-[rgb(var(--color-text-secondary))]">
              <p>
                <span className="font-semibold text-[rgb(var(--color-text-primary))]">Open:</span>{' '}
                Complaint is submitted and waiting for assignment.
              </p>
              <p>
                <span className="font-semibold text-[rgb(var(--color-text-primary))]">
                  In Progress:
                </span>{' '}
                Technician has started work on the complaint.
              </p>
              <p>
                <span className="font-semibold text-[rgb(var(--color-text-primary))]">
                  Closed (Resolved):
                </span>{' '}
                Work is completed and complaint is closed.
              </p>
            </div>
          </article>
        </section>
        <footer className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-5 py-4 text-center text-sm text-[rgb(var(--color-text-secondary))] shadow-sm">
          Made by 235UCS035 Aryan Rastogi and 235UCS062 Himanshi Gautam
        </footer>
      </div>
    </main>
  )
}

export default CustomerDashboardAdvancedPage
