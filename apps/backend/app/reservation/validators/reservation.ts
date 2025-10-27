import { dateSchema } from '#common/validators/date'
import { reservationStatus } from '#models/reservation'
import vine from '@vinejs/vine'

export const createReservationValidator = vine.compile(
  vine.object({
    startDate: dateSchema,
    endDate: dateSchema,
    sportEquipmentId: vine.string(),
  })
)

export const indexReservationsValidator = vine.compile(
  vine.object({
    sportEquipmentId: vine.string().optional(),
    status: vine.enum(reservationStatus).optional(),
  })
)

export const updateReservationStatusValidator = vine.compile(
  vine.object({
    status: vine.enum(reservationStatus),
  })
)
