import vine from '@vinejs/vine'

export const paginationSchema = vine.object({
  page: vine.number().optional(),
  limit: vine.number().optional(),
})

export const paginationValidator = vine.compile(paginationSchema)
