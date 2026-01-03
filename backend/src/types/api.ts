// Tipos para requests y responses de API
export interface ChatRequest {
  question: string
  documentsText?: string
}

export interface ChatResponse {
  success: boolean
  answer?: string
  question: string
  errorId?: string
  timestamp: string
}

export interface ProcessDocumentsRequest {
  files: Array<{
    filename: string
    buffer: Buffer
    mimetype: string
  }>
}

export interface ProcessDocumentsResponse {
  success: boolean
  combined_text?: string
  processed_files?: string[]
  failed_files?: Array<{ filename: string; error: string }>
  total_files?: number
  error?: string
}
