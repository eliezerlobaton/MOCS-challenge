import Fastify from 'fastify'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import { documentsRoutes } from './routes/documents.routes.js'
import { initializeLogger, logger } from './services/logger.js'

const fastify = Fastify()

// Initialize logger
initializeLogger()

// Register plugins
await fastify.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
})

await fastify.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
})

// Routes
await fastify.register(documentsRoutes, { prefix: '/api' })

// Health check
fastify.get('/health', async () => {
  return { 
    status: 'ok', 
    service: 'mocs-backend',
    timestamp: new Date().toISOString()
  }
})

// Start server
const start = async (): Promise<void> => {
  try {
    const port = parseInt(process.env.PORT || '3001')
    const host = process.env.HOST || '0.0.0.0'
    
    await fastify.listen({ port, host })
    
    logger.info(`🚀 Server running on http://${host}:${port}`)
    logger.info(`📚 API docs available at http://${host}:${port}/documentation`)
    
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}

start()
