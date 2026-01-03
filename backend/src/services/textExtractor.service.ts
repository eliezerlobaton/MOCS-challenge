import { createWorker } from 'tesseract.js'
import { logger } from './logger.js'

export const textExtractorService = {
  async extractText(buffer: Buffer, filename: string, mimetype?: string): Promise<string> {
    try {
      const ext = filename.toLowerCase()
      const actualMimeType = mimetype || this.getMimeType(filename)
      
      // Handle PDF
      if (ext.endsWith('.pdf') || actualMimeType === 'application/pdf') {
        const pdfParse = (await import('pdf-parse')).default
        const data = await pdfParse(buffer)
        if (data.text?.trim()) {
          logger.info(`✅ PDF: ${data.text.length} chars`)
          return data.text.trim()
        }
        throw new Error('No text in PDF')
      }
      
      // Handle images with Tesseract.js
      if (ext.match(/\.(jpg|jpeg|png|gif|bmp|tiff)$/) || actualMimeType?.startsWith('image/')) {
        logger.info(`📸 Processing image with Tesseract.js`)
        
        const worker = await createWorker('eng+por')
        const { data: { text } } = await worker.recognize(buffer)
        await worker.terminate()
        
        if (text?.trim()) {
          logger.info(`✅ OCR: ${text.length} chars`)
          return text.trim()
        }
        throw new Error('No text extracted from image')
      }
      
      throw new Error(`Unsupported file type: ${actualMimeType}`)
      
    } catch (error) {
      logger.error('❌ Text extraction failed:', error)
      throw error
    }
  },
  
  getMimeType(filename: string): string {
    const ext = filename.toLowerCase()
    if (ext.endsWith('.pdf')) return 'application/pdf'
    if (ext.match(/\.(jpg|jpeg)$/)) return 'image/jpeg'
    if (ext.endsWith('.png')) return 'image/png'
    if (ext.endsWith('.gif')) return 'image/gif'
    if (ext.endsWith('.bmp')) return 'image/bmp'
    if (ext.endsWith('.tiff')) return 'image/tiff'
    return 'application/octet-stream'
  }
}
