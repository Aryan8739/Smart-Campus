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
  onEvidenceUpload: (files: FileList | null) => void
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
  onEvidenceUpload,
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
              <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Timeline</p>
              <ul className="mt-2 space-y-2">
                {complaint.timeline.map((step) => (
                  <li
                    key={step.id}
                    className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-3 py-2"
                  >
                    <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">{step.label}</p>
                    <p className="text-xs text-[rgb(var(--color-text-secondary))]">{step.when}</p>
                  </li>
                ))}
              </ul>
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

              {complaint.evidence.length > 0 ? (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {complaint.evidence.map((url) => {
                    const isVideo = url.toLowerCase().includes('.mp4') || url.startsWith('blob:') && url.includes('video');
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
                <p className="mt-3 text-xs text-[rgb(var(--color-text-secondary))]">No evidence uploaded yet.</p>
              )}

              {uploadError ? <p className="mt-2 text-xs font-semibold text-[rgb(var(--color-danger))]">{uploadError}</p> : null}
              {uploadMessage ? <p className="mt-2 text-xs font-semibold text-[rgb(var(--color-success))]">{uploadMessage}</p> : null}
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
