export interface ChatMessage {
  type: 'question' | 'answer'
  content: string
  timestamp: Date
}
