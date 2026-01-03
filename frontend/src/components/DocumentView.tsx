import { Button } from '@/components/ui/button'
import type { DocumentCardProps } from '../types'

export function DocumentView({ document, onViewChat }: DocumentCardProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {document.fileName}
              </h2>
              <p className="text-sm text-gray-500">
                Processado em {new Date(document.createdAt).toLocaleString()}
              </p>
            </div>
            <Button
              onClick={onViewChat}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Fazer Perguntas
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="prose max-w-none">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Conteúdo do Documento</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="whitespace-pre-wrap text-sm text-gray-700">
                {document.textContent}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
