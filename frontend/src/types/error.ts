export interface ErrorContext {
  component: string
  action: string
  metadata?: Record<string, unknown>
}

export interface ErrorReport {
  message: string
  stack?: string
  context: ErrorContext
  timestamp: string
  userAgent: string
  url: string
}
