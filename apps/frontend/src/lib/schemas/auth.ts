import { z } from 'zod'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPTED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg']

export const loginFormSchema = z.object({
  email: z.email('Email invalide'),
  password: z.string(),
})

export const forgotPasswordFormSchema = z.object({
  email: z.email('Email invalide'),
})

export const resetPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(8, {
        message: 'Le mot de passe doit faire au moins 8 caractères.',
      })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-!@#$%^&*(),.?":{}|<>])/,
        {
          message:
            'Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial',
        }
      ),
    confirmPassword: z.string().nonempty('Le mot de passe est obligatoire'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })

export const createAccountFormSchema = z
  .object({
    fullName: z.string().min(2, 'Le nom doit faire au moins 2 caractères.'),
    email: z.email('Email invalide'),
    password: z
      .string()
      .min(8, {
        message: 'Le mot de passe doit faire au moins 8 caractères.',
      })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-!@#$%^&*(),.?":{}|<>])/,
        {
          message:
            'Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial',
        }
      ),
    confirmPassword: z.string().nonempty('Le mot de passe est obligatoire'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })
