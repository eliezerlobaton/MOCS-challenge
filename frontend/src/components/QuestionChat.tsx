import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useErrorHandler } from '@/hooks/use-error-handler'
import { apiService } from '../services/api'
import type { QuestionChatProps, ChatMessage } from '../types'

export function QuestionChat({ document }: QuestionChatProps) {
  const [question, setQuestion] = useState<string>('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const { withErrorHandling } = useErrorHandler()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    if (!question.trim() || loading) return

    const userMessage: ChatMessage = {
      type: 'question',
      content: question.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setQuestion('')
    setLoading(true)

    const result = await withErrorHandling(
      () => apiService.askQuestion(document.id, userMessage.content),
      { component: 'QuestionChat', action: 'askQuestion' },
      {
        showLoading: true,
        loadingMessage: 'Obtendo resposta...'
      }
    )

    setLoading(false)

    if (result) {
      const botMessage: ChatMessage = {
        type: 'answer',
        content: result.answer,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Fazer perguntas sobre: {document.fileName}
          </h2>
        </div>

        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Faça uma pergunta sobre o documento para começar
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'question' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'question'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  <span className="text-sm">Pensando...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Faça uma pergunta sobre o documento..."
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" disabled={!question.trim() || loading}>
              Enviar
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
