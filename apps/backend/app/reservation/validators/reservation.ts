import { dateSchema } from '#common/validators/date'
import { invitationStatus } from '#models/invitation'
import { reservationStatus } from '#models/reservation'
import vine from '@vinejs/vine'

export const createReservationValidator = vine.compile(
  vine.object({
    startDate: dateSchema,
    endDate: dateSchema,
    sportEquipmentId: vine.string(),
    invitedUsers: vine.array(vine.string().uuid()).optional(),
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

export const updateInvitationStatusValidator = vine.compile(
  vine.object({
    status: vine.enum(invitationStatus),
  })
)
