import { dateSchema } from '#common/validators/date'
import vine from '@vinejs/vine'
import { reservationStatuses } from '#reservation/models/reservation'
import { invitationStatuses } from '#reservation/models/invitation'

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
    status: vine.enum(reservationStatuses).optional(),
  })
)

export const updateReservationStatusValidator = vine.compile(
  vine.object({
    status: vine.enum(reservationStatuses),
  })
)

export const updateInvitationStatusValidator = vine.compile(
  vine.object({
    status: vine.enum(invitationStatuses),
  })
)
