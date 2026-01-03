import type { ErrorContext, ErrorReport } from "@/types"
import { toast } from "sonner"

class ErrorReporter {
  private reports: ErrorReport[] = []
  private readonly maxReports = 100

  constructor() {
    this.setupGlobalHandler()
  }

  storeError(report: ErrorReport): void {
    this.reports.unshift(report)

    if (this.reports.length > this.maxReports) {
      this.reports = this.reports.slice(0, this.maxReports)
    }

    try {
      localStorage.setItem('mocs_error_reports', JSON.stringify(this.reports.slice(0, 10)))
    } catch (storageError) {
      console.warn('Failed to store error reports in localStorage:', storageError)
    }
  }

  getReports(): ErrorReport[] {
    return [...this.reports]
  }

  cleanReports(): void {
    this.reports = []
  }

  createReport(error: unknown, context: ErrorContext): ErrorReport {
    const message = error instanceof Error ? error.message : String(error)
    const stack = error instanceof Error ? error.stack : undefined

    return {
      message,
      stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }
  }

  private setupGlobalHandler(): void {
    window.addEventListener('error', (event) => {
      const report = this.createReport(event.error, {
        component: 'Global',
        action: 'Unhandled Error',
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      })
      this.storeError(report)
    })
  }
}

class ErrorNotifier {
  private readonly errorMappings: Record<string, string> = {
    'Network Error': 'Connection problem. Please check your internet connection.',
    'Failed to fetch': 'Unable to connect to the server. Please try again.',
    'Unauthorized': 'Your session has expired. Please refresh the page.',
    'Forbidden': 'You don\'t have permission to perform this action.',
    'Not Found': 'The requested resource was not found.',
    'Internal Server Error': 'A server error occurred. Please try again later.',
    'Bad Request': 'Invalid request. Please check your input.',
    'Timeout': 'The request took too long. Please try again.',
  }

  showError(error: unknown): void {
    const message = this.getUserFriendlyMessage(error)
    toast.error(message)
  }

  private getUserFriendlyMessage(error: unknown): string {
    const message = error instanceof Error ? error.message : String(error)

    for (const [pattern, friendlyMessage] of Object.entries(this.errorMappings)) {
      if (message.includes(pattern)) {
        return friendlyMessage
      }
    }

    return 'An unexpected error occurred. Please try again.'
  }
}

class ErrorHandler {
  private reporter: ErrorReporter
  private notifier: ErrorNotifier

  constructor(reporter: ErrorReporter, notifier: ErrorNotifier) {
    this.reporter = reporter
    this.notifier = notifier
  }

  handleError(error: unknown, context: ErrorContext): void {
    const report = this.reporter.createReport(error, context)
    this.reporter.storeError(report)
    this.notifier.showError(error)
  }

  handleApiError(error: unknown, context: ErrorContext): string {
    const report = this.reporter.createReport(error, context)
    this.reporter.storeError(report)
    
    const message = error instanceof Error ? error.message : String(error)
    this.notifier.showError(error)
    
    return message
  }

  async withErrorHandling<T>(
    operation: () => Promise<T>,
    context: ErrorContext,
    options?: {
      showLoading?: boolean
      successMessage?: string
      loadingMessage?: string
    }
  ): Promise<T | null> {
    let toastId: string | number | undefined

    try {
      if (options?.showLoading) {
        toastId = toast.loading(options.loadingMessage || 'Processing...')
      }

      const result = await operation()

      if (toastId) {
        toast.dismiss(toastId)
      }

      if (options?.successMessage) {
        toast.success(options.successMessage)
      }

      return result
    } catch (error) {
      if (toastId) {
        toast.dismiss(toastId)
      }

      this.handleError(error, context)
      return null
    }
  }

  getReports(): ErrorReport[] {
    return this.reporter.getReports()
  }

  clearReports(): void {
    this.reporter.cleanReports()
  }

  getErrorReports(): ErrorReport[] {
    return this.getReports()
  }

  clearErrorReports(): void {
    this.clearReports()
  }
}

export const errorHandler = new ErrorHandler(
  new ErrorReporter(),
  new ErrorNotifier()
)

//Global handler for Unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  errorHandler.handleError(event.reason, {
    component: 'Global',
    action: 'Unhandled Promise rejection'
  })
})
