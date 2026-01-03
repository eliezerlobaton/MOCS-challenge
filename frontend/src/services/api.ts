import type { Document, QuestionResponse, ApiError } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({ 
        error: `HTTP ${response.status}: ${response.statusText}` 
      }))
      throw new Error(errorData.error)
    }

    return response.json()
  }

  async uploadDocument(file: File): Promise<Document> {
    console.log('🌐 API: Starting upload request for:', file.name)
    const formData = new FormData()
    formData.append('document', file)

    const url = `${API_BASE_URL}/api/documents/upload`
    console.log('🌐 API: Uploading to:', url)

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      })

      console.log('🌐 API: Response status:', response.status)
      console.log('🌐 API: Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        let errorData: ApiError
        try {
          errorData = await response.json()
        } catch {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` }
        }
        throw new Error(errorData.error)
      }

      const result = await response.json()
      console.log('🌐 API: Success response:', result)
      return result
    } catch (error) {
      console.error('🌐 API: Upload failed:', error)
      throw error
    }
  }

  async askQuestion(documentId: string, question: string): Promise<QuestionResponse> {
    return this.request<QuestionResponse>('/api/documents/question', {
      method: 'POST',
      body: JSON.stringify({ documentId, question }),
    })
  }

  async getDocuments(): Promise<Document[]> {
    return this.request<Document[]>('/api/documents')
  }

  async getDocument(id: string): Promise<Document> {
    return this.request<Document>(`/api/documents/${id}`)
  }
}

export const apiService = new ApiService()
