export interface Document {
  id: string
  fileName: string
  textContent: string
  createdAt: string
}

export interface QuestionResponse {
  question: string
  answer: string
  documentId: string
}

export interface ApiError {
  error: string
}
