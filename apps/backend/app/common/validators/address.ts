import vine from '@vinejs/vine'

export const addressSchema = vine.object({
  label: vine.string().trim().minLength(2).maxLength(200),
  postalCode: vine.string().postalCode({ countryCode: ['FR'] }),
  city: vine.string().trim().minLength(2).maxLength(100),
})
