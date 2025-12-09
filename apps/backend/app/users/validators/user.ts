import vine from '@vinejs/vine'

export const updateUserValidator = vine.compile(
  vine.object({
    avatar: vine
      .file({
        extnames: ['jpg', 'jpeg', 'png', 'gif'],
        size: '5mb',
      })
      .optional(),
    fullName: vine.string().minLength(3).maxLength(100).optional(),
    email: vine.string().email().optional(),
  })
)
