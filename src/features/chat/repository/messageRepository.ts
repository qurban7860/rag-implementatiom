import { prisma } from '@/lib/prisma'
import { Message } from '@prisma/client'

export class MessageRepository {
  async findById(id: string): Promise<Message | null> {
    return prisma.message.findUnique({
      where: { id },
    })
  }

  async findByChatSessionId(chatSessionId: string): Promise<Message[]> {
    return prisma.message.findMany({
      where: { chatSessionId },
      orderBy: { createdAt: 'asc' },
    })
  }

  async create(data: { chatSessionId: string; role: string; content: string }): Promise<Message> {
    return prisma.message.create({
      data,
    })
  }

  async delete(id: string): Promise<Message> {
    return prisma.message.delete({
      where: { id },
    })
  }
}