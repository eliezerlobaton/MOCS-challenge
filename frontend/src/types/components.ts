import type { Document } from "./document";

export interface FileUploadProps {
  onDocumentUploaded: (document: Document) => void
}

export interface DocumentCardProps {
  document: Document
  onViewChat: () => void
}

export interface QuestionChatProps {
  document: Document
}
