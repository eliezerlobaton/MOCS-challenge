
import { useState } from 'react'
import { DocumentUpload } from './components/DocumentUpload'
import { DocumentView } from './components/DocumentView'
import { QuestionChat } from './components/QuestionChat'
import { Toaster } from './components/ui/toaster'
import type { Document } from './types'

type View = 'upload' | 'document' | 'chat'

function App() {
  const [currentView, setCurrentView] = useState<View>('upload')
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null)

  const handleDocumentUploaded = (document: Document) => {
    setCurrentDocument(document)
    setCurrentView('document')
  }

  const handleViewChat = () => {
    setCurrentView('chat')
  }

  const handleBackToUpload = () => {
    setCurrentView('upload')
    setCurrentDocument(null)
  }

  const handleBackToDocument = () => {
    setCurrentView('document')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">MOCS Chat de Documentos</h1>
            <nav className="flex space-x-4">
              <button
                onClick={handleBackToUpload}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'upload'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Enviar
              </button>
              {currentDocument && (
                <>
                  <button
                    onClick={handleBackToDocument}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      currentView === 'document'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Documento
                  </button>
                  <button
                    onClick={handleViewChat}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      currentView === 'chat'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Chat
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {currentView === 'upload' && (
            <div className="max-w-md mx-auto">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Enviar Documento
                </h2>
                <DocumentUpload onDocumentUploaded={handleDocumentUploaded} />
              </div>
            </div>
          )}

          {currentView === 'document' && currentDocument && (
            <DocumentView document={currentDocument} onViewChat={handleViewChat} />
          )}

          {currentView === 'chat' && currentDocument && (
            <QuestionChat document={currentDocument} />
          )}
        </div>
      </main>

      <Toaster />
    </div>
  )
}

export default App
