import { z } from 'zod'

export const createChatSessionSchema = z.object({
  userId: z.string().cuid(),
  title: z.string().optional(),
})

export const sendMessageSchema = z.object({
  chatSessionId: z.string().cuid(),
  message: z.string().min(1).max(1000),
})