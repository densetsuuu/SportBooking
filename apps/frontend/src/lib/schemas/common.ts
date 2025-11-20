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

export const reservationSchema = z.object({
  date: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Date invalide',
  }),
  timeSlot: z.string().regex(/^\d{2}h-\d{2}h$/, {
    message: 'Créneau horaire invalide',
  }),
  participants: z.number().min(1, {
    message: 'Le nombre de participants doit être au moins 1',
  }),
})
