import vine from '@vinejs/vine'

export const indexSportEquipmentsValidator = vine.compile(
  vine.object({
    typeSport: vine.string().optional(),
    ville: vine.string().optional(),
  })
)
