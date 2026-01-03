import { Pool } from 'pg'
import type { Document } from '../types/index.js'
import { logger } from './logger.js'

// Detecção automática de ambiente
const isDocker = process.env.DOCKER === 'true' || process.env.IS_DOCKER === 'true'
const dbHost = isDocker ? 'db' : 'localhost'

const DATABASE_URL = process.env.DATABASE_URL?.replace('@db:', `@${dbHost}:`) || 
  `postgresql://mocs_user:mocs_password@${dbHost}:5432/mocs_db`

logger.info(`🔌 Conectando ao banco: ${DATABASE_URL.replace(/:[^:]*@/, ':****@')}`)

const pool = new Pool({
  connectionString: DATABASE_URL
})

export const database = {
  async storeDocument(document: Document): Promise<void> {
    try {
      logger.info(`💾 Storing document in database: ${document.id}`)
      
      const query = `
        INSERT INTO documents (id, file_name, text_content, created_at)
        VALUES ($1, $2, $3, $4)
      `
      
      await pool.query(query, [
        document.id,
        document.fileName,
        document.textContent,
        document.createdAt
      ])
      
      logger.info(`✅ Document stored successfully: ${document.id}`)
      
    } catch (error) {
      logger.error({ err: error }, '❌ Error storing document')
      throw error
    }
  },

  async getDocument(id: string): Promise<Document | null> {
    try {
      logger.info(`🔍 Getting document from database: ${id}`)
      
      const query = 'SELECT * FROM documents WHERE id = $1'
      const result = await pool.query(query, [id])
      
      if (result.rows.length === 0) {
        logger.warn(`❌ Document not found in database: ${id}`)
        return null
      }
      
      const row = result.rows[0]
      const document: Document = {
        id: row.id,
        fileName: row.file_name,
        textContent: row.text_content,
        createdAt: row.created_at
      }
      
      logger.info(`✅ Document retrieved from database: ${id}`)
      return document
      
    } catch (error) {
      logger.error('❌ Error getting document:', error)
      throw error
    }
  },

  async getAllDocuments(): Promise<Document[]> {
    try {
      logger.info('📚 Getting all documents from database')
      
      const query = 'SELECT * FROM documents ORDER BY created_at DESC'
      const result = await pool.query(query)
      
      const documents: Document[] = result.rows.map(row => ({
        id: row.id,
        fileName: row.file_name,
        textContent: row.text_content,
        createdAt: row.created_at
      }))
      
      logger.info(`✅ Retrieved ${documents.length} documents from database`)
      return documents
      
    } catch (error) {
      logger.error('❌ Error getting all documents:', error)
      throw error
    }
  },

  async deleteDocument(id: string): Promise<boolean> {
    try {
      logger.info(`🗑️ Deleting document from database: ${id}`)
      
      const query = 'DELETE FROM documents WHERE id = $1'
      const result = await pool.query(query, [id])
      
      const deleted = (result.rowCount || 0) > 0
      
      if (deleted) {
        logger.info(`✅ Document deleted successfully: ${id}`)
      } else {
        logger.warn(`❌ Document not found for deletion: ${id}`)
      }
      
      return deleted
      
    } catch (error) {
      logger.error('❌ Error deleting document:', error)
      throw error
    }
  },

  async close(): Promise<void> {
    try {
      await pool.end()
      logger.info('✅ Database connection closed')
    } catch (error) {
      logger.error('❌ Error closing database:', error)
      throw error
    }
  }
}
