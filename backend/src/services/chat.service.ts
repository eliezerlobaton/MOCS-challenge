import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from './logger.js';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export class ChatService {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash'
    });
  }

  async answerQuestion(question: string, documentText: string): Promise<string> {
    try {
      logger.info('Processing question with Gemini API');
      
      const prompt = `Você é um assistente especializado em análise de documentos. Com base no contexto fornecido, responda a pergunta do usuário de forma clara e objetiva.

Contexto do documento:
${documentText}

Pergunta do usuário: ${question}

Instruções:
- Responda apenas com base nas informações fornecidas no contexto
- Se a informação não estiver disponível, informe claramente
- Seja direto e objetivo
- Use português do Brasil

Resposta:`;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const answer = response.text();
      
      logger.info('Question answered successfully');
      return answer;
    } catch (error) {
      logger.error('❌ Error answering question:');
      logger.error(error);
      if (error instanceof Error) {
        logger.error('Error message:', error.message);
        logger.error('Error stack:', error.stack);
      }
      throw error;
    }
  }
}

export const chatService = new ChatService();
