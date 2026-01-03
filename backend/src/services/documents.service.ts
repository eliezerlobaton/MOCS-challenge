import { MultipartFile } from '@fastify/multipart'
import { v4 as uuidv4 } from 'uuid'
import { database } from './database.js'
import { textExtractorService } from './textExtractor.service.js'
import { logger } from './logger.js'
import type { Document } from '../types/index.js'

export const documentsService = {
  async processDocument(file: MultipartFile): Promise<Document> {
    try {
      logger.info(`🔄 Processing document: ${file.filename}`)
      logger.info(`📝 Mimetype: ${file.mimetype}`)
      
      // Read file buffer
      const buffer = await file.toBuffer()
      logger.info(`📊 File size: ${buffer.length} bytes`)
      
      // Extract text
      logger.info('📄 Extracting text...')
      const textContent = await textExtractorService.extractText(
        buffer, 
        file.filename || 'document',
        file.mimetype
      )
      
      if (!textContent || textContent.trim().length === 0) {
        throw new Error('No text content could be extracted from the document')
      }
      
      logger.info(`📝 Extracted ${textContent.length} characters of text`)
      
      // Create document record
      const document: Document = {
        id: uuidv4(),
        fileName: file.filename || 'unknown',
        textContent: textContent.trim(),
        createdAt: new Date().toISOString()
      }
      
      // Store in database
      logger.info(`💾 Storing document in database: ${document.id}`)
      await database.storeDocument(document)
      
      logger.info(`✅ Document processed successfully: ${document.id}`)
      return document
      
    } catch (error) {
      logger.error('❌ Error processing document:', error)
      throw error
    }
  },

  async getById(id: string): Promise<Document | null> {
    try {
      logger.info(`🔍 Retrieving document: ${id}`)
      const document = await database.getDocument(id)
      
      if (!document) {
        logger.warn(`❌ Document not found: ${id}`)
        return null
      }
      
      logger.info(`✅ Document retrieved: ${id}`)
      return document
      
    } catch (error) {
      logger.error('❌ Error retrieving document:', error)
      throw error
    }
  },

  async getAll(): Promise<Document[]> {
    try {
      logger.info('📚 Retrieving all documents')
      const documents = await database.getAllDocuments()
      logger.info(`✅ Retrieved ${documents.length} documents`)
      return documents
      
    } catch (error) {
      logger.error('❌ Error retrieving documents:', error)
      throw error
    }
  }
}
