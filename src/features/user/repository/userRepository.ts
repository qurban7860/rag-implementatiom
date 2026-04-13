import { prisma } from '@/lib/prisma'
import { User } from '@prisma/client'

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    })
  }

  async create(data: { email: string; name?: string }): Promise<User> {
    return prisma.user.create({
      data,
    })
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    })
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    })
  }
}