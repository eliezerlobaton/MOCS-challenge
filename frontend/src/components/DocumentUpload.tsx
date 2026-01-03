import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useErrorHandler } from '@/hooks/use-error-handler'
import { toast } from 'sonner'
import { apiService } from '../services/api'
import type { FileUploadProps } from '../types'

export function DocumentUpload({ onDocumentUploaded }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const { withErrorHandling } = useErrorHandler()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleUpload = async (): Promise<void> => {
    if (!file) return

    console.log('🚀 Starting upload for file:', file.name)
    setLoading(true)
    setError(null)

    const result = await withErrorHandling(
      async () => {
        console.log('📤 Calling API upload...')
        const response = await apiService.uploadDocument(file)
        console.log('✅ Upload successful:', response)
        return response
      },
      { component: 'DocumentUpload', action: 'upload' },
      {
        showLoading: true,
        loadingMessage: 'Enviando documento...',
        successMessage: 'Documento enviado com sucesso!'
      }
    )

    setLoading(false)
    console.log('📋 Upload result:', result)

    if (result) {
      onDocumentUploaded(result)
      setFile(null)
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="file-upload" className="text-sm font-medium">
          Selecionar Documento
        </label>
        <Input
          id="file-upload"
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
          disabled={loading}
        />
      </div>

      {file && (
        <div className="p-3 bg-gray-50 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        </div>
      )}

      {error && toast.error(error)}

      <Button
        onClick={handleUpload}
        disabled={!file || loading}
        className="w-full"
        size="lg"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Enviando...
          </>
        ) : (
          'Enviar Documento'
        )}
      </Button>
    </div>
  )
}
