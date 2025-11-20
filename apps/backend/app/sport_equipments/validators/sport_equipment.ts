import vine from '@vinejs/vine'

export const indexSportEquipmentsValidator = vine.compile(
  vine.object({
    typeSport: vine.string().optional(),
    ville: vine.string().optional(),
    page: vine.number().optional(),
    limit: vine.number().optional(),
    nom: vine.string().optional(),
  })
)
