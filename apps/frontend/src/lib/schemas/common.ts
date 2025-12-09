import { z } from 'zod'

export const passwordSchema = z
  .string()
  .min(8, {
    message: 'Le mot de passe doit faire au moins 8 caractères.',
  })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>;'-])/, {
    message:
      'Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial',
  })

export const searchSchema = z.object({
  name: z.string().optional().catch(''),
  sport: z.string().optional().catch(''),
  city: z.string().optional().catch(''),
})

export const reservationSchema = z.object({
  startDate: z.date({
    message: 'Date invalide',
  }),
  endDate: z.date({
    message: 'Date invalide',
  }),
  participants: z.number().min(1, {
    message: 'Le nombre de participants doit être au moins 1',
  }),
})
