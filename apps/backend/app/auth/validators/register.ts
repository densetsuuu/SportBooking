import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    email: vine.string().email().toLowerCase().trim(),
    password: vine.string().minLength(8).trim(),
    fullName: vine.string().minLength(3).maxLength(255).trim(),
    phone: vine.string().minLength(10).maxLength(15).trim().optional(),
  })
)
