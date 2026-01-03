// Exportaciones centralizadas
export * from './api.js'
export * from './database.js'

// Tipos generales
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ErrorResponse {
  success: false
  error: string
  code?: string
  details?: Record<string, unknown>
}
