import vine from '@vinejs/vine'

/**
 * Validator for assigning an owner to a sport equipment
 */
export const assignOwnerValidator = vine.compile(
  vine.object({
    userId: vine.string().uuid(),
    phoneNumber: vine.string(),
    file: vine.file({
      size: '10mb',
      extnames: ['jpg', 'png', 'pdf', 'jpeg'],
    }),
  })
)

/**
 * Validator for updating an owner of a sport equipment
 */
export const updateOwnerValidator = vine.compile(
  vine.object({
    userId: vine.string().uuid(),
  })
)
