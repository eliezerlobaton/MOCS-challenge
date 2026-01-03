import { errorHandler } from '@/lib/error-handlers'
import type { ErrorContext } from '@/types'
import { useCallback } from 'react'

export const useErrorHandler = () => {
  const handleError = useCallback((error: unknown, context: ErrorContext) => {
    errorHandler.handleError(error, context)
  }, [])

  const handleApiError = useCallback((error: unknown, context: ErrorContext): string => {
    return errorHandler.handleApiError(error, context)
  }, [])

  const withErrorHandling = useCallback(async <T>(
    operation: () => Promise<T>,
    context: ErrorContext,
    options?: {
      showLoading?: boolean
      successMessage?: string
      loadingMessage?: string
    }
  ): Promise<T | null> => {
    return errorHandler.withErrorHandling(operation, context, options)
  }, [])

  return {
    handleError,
    handleApiError,
    withErrorHandling,
    getErrorReports: errorHandler.getErrorReports.bind(errorHandler),
    clearErrorReports: errorHandler.clearErrorReports.bind(errorHandler)
  }
}
