import { z } from 'zod'

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
})

export const updateUserSchema = z.object({
  id: z.string().cuid(),
  data: z.object({
    email: z.string().email().optional(),
    name: z.string().optional(),
  }),
})