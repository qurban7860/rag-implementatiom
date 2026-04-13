import { ChatSessionRepository } from '../repository/chatSessionRepository'
import { MessageRepository } from '../repository/messageRepository'
import { ChatSession, Message } from '@prisma/client'
import { AIService } from './aiService'

export class ChatService {
  private chatSessionRepository: ChatSessionRepository
  private messageRepository: MessageRepository
  private aiService: AIService

  constructor() {
    this.chatSessionRepository = new ChatSessionRepository()
    this.messageRepository = new MessageRepository()
    this.aiService = new AIService()
  }

  async getChatSessionById(id: string): Promise<ChatSession | null> {
    return this.chatSessionRepository.findById(id)
  }

  async getChatSessionsByUserId(userId: string): Promise<ChatSession[]> {
    return this.chatSessionRepository.findByUserId(userId)
  }

  async createChatSession(data: { userId: string; title?: string }): Promise<ChatSession> {
    // Business logic: ensure user exists, set default title, etc.
    return this.chatSessionRepository.create(data)
  }

  async updateChatSession(id: string, data: Partial<ChatSession>): Promise<ChatSession> {
    return this.chatSessionRepository.update(id, data)
  }

  async deleteChatSession(id: string): Promise<ChatSession> {
    return this.chatSessionRepository.delete(id)
  }

  async getMessagesByChatSessionId(chatSessionId: string): Promise<Message[]> {
    return this.messageRepository.findByChatSessionId(chatSessionId)
  }

  async createMessage(data: { chatSessionId: string; role: string; content: string }): Promise<Message> {
    // Business logic: validate role, content, etc.
    if (!['user', 'assistant'].includes(data.role)) {
      throw new Error('Invalid role')
    }
    return this.messageRepository.create(data)
  }

  async deleteMessage(id: string): Promise<Message> {
    return this.messageRepository.delete(id)
  }

  async generateAIResponse(chatSessionId: string, userMessage: string, stream: boolean = false) {
    // Save user message
    await this.createMessage({ chatSessionId, role: 'user', content: userMessage })

    const messages = await this.getMessagesByChatSessionId(chatSessionId)
    const messageHistory = messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))

    const response = await this.aiService.generateResponse(messageHistory, { stream })

    if (!stream) {
      await this.createMessage({ chatSessionId, role: 'assistant', content: response as string })
    }

    return response
  }
}