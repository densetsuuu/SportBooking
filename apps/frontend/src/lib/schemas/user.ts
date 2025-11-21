import { z } from 'zod'

export const updateUserSchema = z.object({
  fullName: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  avatar: z.instanceof(File).optional(),
})
