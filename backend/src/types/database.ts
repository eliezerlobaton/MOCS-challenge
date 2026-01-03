// Tipos para base de datos
export interface Document {
  id: string
  fileName: string
  textContent: string
  createdAt: string
}

export interface CreateDocumentData {
  fileName: string
  textContent: string
}

export interface DocumentResponse {
  id: string
  fileName: string
  textContent: string
  createdAt: string
}
