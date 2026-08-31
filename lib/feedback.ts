export type FeedbackKind = 'press' | 'open' | 'success' | 'settle' | 'error' | 'discover' | 'strong'

export type StudioFeedbackDetail = {
  kind: FeedbackKind
  /** Haptic only: useful for passive physical events such as paper settling. */
  quiet?: boolean
}

/** Components describe meaning; InteractionLayer owns the device response. */
export function emitFeedback(kind: FeedbackKind, options: Omit<StudioFeedbackDetail, 'kind'> = {}) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent<StudioFeedbackDetail>('studio:feedback', {
    detail: { kind, ...options },
  }))
}
