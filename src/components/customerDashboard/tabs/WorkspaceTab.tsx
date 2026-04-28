import { priorityBadgeClasses, statusBadgeClasses } from '../types'
import type { Complaint, FeedbackItem } from '../types'

type WorkspaceTabProps = {
  complaint: Complaint | null
  feedback: FeedbackItem | null
  feedbackRating: number
  feedbackComment: string
  uploadError: string
  uploadMessage: string
  feedbackError: string
  feedbackMessage: string
  pendingFiles: { file: File; preview: string }[]
  isCompressing: boolean
  onEvidenceUpload: (files: FileList | null) => void
  onRemovePendingFile: (index: number) => void
  onFinalizeUpload: () => void
  onFeedbackRatingChange: (value: number) => void
  onFeedbackCommentChange: (value: string) => void
  onSubmitFeedback: () => void
  onReopen: () => void
  onCopyComplaintId: () => void
}

function WorkspaceTab({
  complaint,
  feedback,
  feedbackRating,
  feedbackComment,
  uploadError,
  uploadMessage,
  feedbackError,
  feedbackMessage,
  pendingFiles,
  isCompressing,
  onEvidenceUpload,
  onRemovePendingFile,
  onFinalizeUpload,
  onFeedbackRatingChange,
  onFeedbackCommentChange,
  onSubmitFeedback,
  onReopen,
  onCopyComplaintId,
}: WorkspaceTabProps) {
  return (
    <section className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Complaint Workspace</h2>
      <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
        Detailed lifecycle panel with timeline, evidence upload, reopen action, and feedback loop.
      </p>

      {complaint ? (
        <div className="mt-4 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-[rgb(var(--color-text-secondary))]">{complaint.id}</p>
                <h3 className="mt-1 text-lg font-semibold text-[rgb(var(--color-text-primary))]">{complaint.title}</h3>
              </div>
              <div className="flex gap-2">
                <span className={['rounded-full border px-2 py-1 text-xs font-semibold', priorityBadgeClasses[complaint.priority]].join(' ')}>
                  {complaint.priority}
                </span>
                <span className={['rounded-full border px-2 py-1 text-xs font-semibold', statusBadgeClasses[complaint.status]].join(' ')}>
                  {complaint.status}
                </span>
              </div>
            </div>

            <p className="mt-3 text-sm text-[rgb(var(--color-text-secondary))]">{complaint.description}</p>

            <div className="mt-3 grid gap-2 text-xs text-[rgb(var(--color-text-secondary))] sm:grid-cols-2">
              <p>
                <span className="font-semibold text-[rgb(var(--color-text-primary))]">Location:</span> {complaint.location}
              </p>
              <p>
                <span className="font-semibold text-[rgb(var(--color-text-primary))]">Assigned Team:</span> {complaint.assignedTeam}
              </p>
              <p>
                <span className="font-semibold text-[rgb(var(--color-text-primary))]">Created:</span> {complaint.createdAt}
              </p>
              <p>
                <span className="font-semibold text-[rgb(var(--color-text-primary))]">Invoice:</span> {complaint.invoiceStatus}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onCopyComplaintId}
                className="rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-2.5 py-1.5 text-[11px] font-semibold"
              >
                Copy Complaint ID
              </button>
            </div>

            <div className="mt-4">
              <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Activity Timeline</p>
              <div className="relative mt-4 ml-2 space-y-6 border-l-2 border-[rgb(var(--color-border))] pl-6">
                {complaint.timeline.map((step, idx) => (
                  <div key={step.id} className="relative">
                    <div className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-2 border-[rgb(var(--color-primary))] bg-[rgb(var(--color-bg))]" />
                    <div className="group rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-3 transition hover:border-[rgb(var(--color-primary))/0.3]">
                      <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))] group-hover:text-[rgb(var(--color-primary))]">{step.label}</p>
                      <p className="mt-0.5 text-xs text-[rgb(var(--color-text-secondary))]">{step.when}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="space-y-4">
            <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-4">
              <h4 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Upload Evidence</h4>
              <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">Allowed: JPG, PNG, MP4 up to 10MB</p>

              <label
                htmlFor="workspace-evidence-upload"
                className="mt-3 block cursor-pointer rounded-xl border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-3 py-4 text-center text-xs text-[rgb(var(--color-text-secondary))]"
              >
                Select file(s) for {complaint.id}
              </label>
              <input
                id="workspace-evidence-upload"
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.mp4"
                onChange={(event) => onEvidenceUpload(event.target.files)}
                className="hidden"
              />

              {isCompressing && (
                <div className="mt-3 flex items-center gap-2 text-xs text-[rgb(var(--color-primary))]">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-[rgb(var(--color-primary))] border-t-transparent" />
                  Optimizing and compressing images...
                </div>
              )}

              {pendingFiles.length > 0 && (
                <div className="mt-4 space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[rgb(var(--color-text-secondary))]">Staged for Upload</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {pendingFiles.map((p, idx) => {
                      const isVideo = p.file.type.includes('video')
                      return (
                        <div key={p.preview} className="group relative aspect-square overflow-hidden rounded-xl border-2 border-[rgb(var(--color-primary))/0.3] bg-[rgb(var(--color-card))] shadow-sm">
                          {isVideo ? (
                            <video src={p.preview} className="h-full w-full object-cover" />
                          ) : (
                            <img src={p.preview} className="h-full w-full object-cover" />
                          )}
                          <button
                            type="button"
                            onClick={() => onRemovePendingFile(idx)}
                            className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100 hover:bg-[rgb(var(--color-danger))]"
                          >
                            ×
                          </button>
                        </div>
                      )
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={onFinalizeUpload}
                    className="w-full rounded-xl bg-[rgb(var(--color-primary))] py-2.5 text-xs font-bold text-white shadow-lg transition hover:bg-[rgb(var(--color-primary-hover))] active:scale-[0.98]"
                  >
                    Confirm & Attach to Ticket
                  </button>
                </div>
              )}

              <div className="mt-6 border-t border-[rgb(var(--color-border))] pt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[rgb(var(--color-text-secondary))]">Attached Evidence</p>
                {complaint.evidence.length > 0 ? (
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {complaint.evidence.map((url) => {
                      const isVideo = url.toLowerCase().includes('.mp4') || (url.startsWith('blob:') && url.includes('video'))
                      return (
                        <div key={url} className="group relative aspect-square overflow-hidden rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] shadow-sm transition hover:scale-[1.02]">
                          {isVideo ? (
                            <video src={url} className="h-full w-full object-cover" />
                          ) : (
                            <img src={url} alt="Evidence" className="h-full w-full object-cover" />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                             <span className="text-[10px] font-bold text-white uppercase">{isVideo ? 'Video' : 'Image'}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-[rgb(var(--color-text-secondary))] italic">No finalized evidence yet.</p>
                )}
              </div>

              {uploadError ? <p className="mt-3 text-xs font-semibold text-[rgb(var(--color-danger))]">{uploadError}</p> : null}
              {uploadMessage ? <p className="mt-3 text-xs font-semibold text-[rgb(var(--color-success))]">{uploadMessage}</p> : null}
            </div>

            <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-4">
              <h4 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Reopen Request</h4>
              <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
                Request reopen if service quality is unsatisfactory after closure.
              </p>
              <button
                type="button"
                onClick={onReopen}
                disabled={complaint.status !== 'Resolved'}
                className="mt-3 rounded-lg bg-[rgb(var(--color-danger))] px-3 py-2 text-xs font-semibold text-white transition enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Request Reopen
              </button>
            </div>

            <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-4">
              <h4 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Feedback & Rating</h4>
              <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
                Mandatory quality feedback for resolved complaints.
              </p>

              {complaint.status === 'Resolved' ? (
                <>
                  {feedback ? (
                    <div className="mt-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-3">
                      <p className="text-xs font-semibold text-[rgb(var(--color-text-primary))]">Submitted Rating: {feedback.rating}/5</p>
                      <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">{feedback.comment}</p>
                      <p className="mt-1 text-[11px] text-[rgb(var(--color-text-secondary))]">{feedback.submittedAt}</p>
                    </div>
                  ) : null}

                  <div className="mt-3 flex gap-2">
                    <label className="text-xs text-[rgb(var(--color-text-secondary))]">Rating</label>
                    <select
                      value={feedbackRating}
                      onChange={(event) => onFeedbackRatingChange(Number(event.target.value))}
                      className="rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-2 py-1 text-xs"
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </select>
                  </div>

                  <textarea
                    value={feedbackComment}
                    onChange={(event) => onFeedbackCommentChange(event.target.value)}
                    rows={2}
                    placeholder="Share service quality remarks"
                    className="mt-2 w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-2 py-2 text-xs"
                  />

                  {feedbackError ? <p className="mt-2 text-xs font-semibold text-[rgb(var(--color-danger))]">{feedbackError}</p> : null}
                  {feedbackMessage ? <p className="mt-2 text-xs font-semibold text-[rgb(var(--color-success))]">{feedbackMessage}</p> : null}

                  <button
                    type="button"
                    onClick={onSubmitFeedback}
                    className="mt-3 rounded-lg bg-[rgb(var(--color-primary))] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[rgb(var(--color-primary-hover))]"
                  >
                    Submit Feedback
                  </button>
                </>
              ) : (
                <p className="mt-3 text-xs text-[rgb(var(--color-text-secondary))]">
                  Feedback will be enabled when complaint status becomes Resolved.
                </p>
              )}
            </div>
          </article>
        </div>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-4 text-sm text-[rgb(var(--color-text-secondary))]">
          Select a complaint from tracker to view detailed workspace.
        </p>
      )}
    </section>
  )
}

export default WorkspaceTab
