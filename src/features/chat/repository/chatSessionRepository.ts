import { prisma } from '@/lib/prisma'
import { ChatSession } from '@prisma/client'

export class ChatSessionRepository {
  async findById(id: string): Promise<ChatSession | null> {
    return prisma.chatSession.findUnique({
      where: { id },
      include: { messages: true },
    })
  }

  async findByUserId(userId: string): Promise<ChatSession[]> {
    return prisma.chatSession.findMany({
      where: { userId },
      include: { messages: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async create(data: { userId: string; title?: string }): Promise<ChatSession> {
    return prisma.chatSession.create({
      data,
    })
  }

  async update(id: string, data: Partial<ChatSession>): Promise<ChatSession> {
    return prisma.chatSession.update({
      where: { id },
      data,
    })
  }

  async delete(id: string): Promise<ChatSession> {
    return prisma.chatSession.delete({
      where: { id },
    })
  }
}