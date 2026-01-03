import { FastifyInstance } from 'fastify'
import { documentsController } from '../controllers/documents.controller.js'

export async function documentsRoutes(fastify: FastifyInstance): Promise<void> {
  
  fastify.post('/documents/upload', documentsController.upload.bind(documentsController))
  
  fastify.get<{ Params: { id: string } }>('/documents/:id', documentsController.getById.bind(documentsController))
  
  fastify.post('/documents/question', documentsController.askQuestion.bind(documentsController))
}
