import { FastifyRequest, FastifyReply } from 'fastify'
import { documentsService } from '../services/documents.service.js'
import { chatService } from '../services/chat.service.js'
import { logger } from '../services/logger.js'

export const documentsController = {
  async upload(request: FastifyRequest, reply: FastifyReply) {
    try {
      logger.info('📤 Document upload request received')
      
      const data = await request.file()
      if (!data) {
        logger.warn('❌ No file provided in upload request')
        return reply.status(400).send({ error: 'No file provided' })
      }

      logger.info(`📄 Processing file: ${data.filename}`)
      
      const document = await documentsService.processDocument(data)
      
      logger.info(`✅ Document processed successfully: ${document.id}`)
      return reply.send(document)
      
    } catch (error) {
      logger.error('❌ Error uploading document:', error)
      return reply.status(500).send({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      })
    }
  },

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      logger.info(`📖 Getting document: ${id}`)
      
      const document = await documentsService.getById(id)
      
      if (!document) {
        logger.warn(`❌ Document not found: ${id}`)
        return reply.status(404).send({ error: 'Document not found' })
      }
      
      logger.info(`✅ Document retrieved: ${id}`)
      return reply.send(document)
      
    } catch (error) {
      logger.error('❌ Error getting document:', error)
      return reply.status(500).send({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      })
    }
  },

  async askQuestion(request: FastifyRequest<{ Body: { documentId: string, question: string } }>, reply: FastifyReply) {
    try {
      const { documentId, question } = request.body
      logger.info(`💬 Question received for document: ${documentId}`)
      
      const document = await documentsService.getById(documentId)
      
      if (!document) {
        logger.warn(`❌ Document not found: ${documentId}`)
        return reply.status(404).send({ error: 'Document not found' })
      }
      
      const answer = await chatService.answerQuestion(question, document.textContent)
      
      logger.info(`✅ Question answered successfully`)
      return reply.send({ answer })
      
    } catch (error) {
      logger.error('❌ Error answering question:', error)
      return reply.status(500).send({ 
        error: error instanceof Error ? error.message : 'Failed to answer question' 
      })
    }
  }
}
