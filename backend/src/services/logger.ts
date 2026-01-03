import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info'
})

export function initializeLogger(): void {
  logger.info('Logger initialized')
}
