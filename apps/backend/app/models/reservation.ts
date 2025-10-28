import { withUUID } from '#common/mixins/with_uuid'
import User from '#users/models/user'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export const reservationStatus = ['waiting', 'confirmed', 'cancelled'] as const
export type ReservationStatus = (typeof reservationStatus)[number]

export const invitationStatus = ['waiting', 'confirmed', 'refused'] as const
export type InvitationStatus = (typeof invitationStatus)[number]

export type InvitedUser = {
  userId: string
  status: InvitationStatus
}

export default class Reservation extends compose(BaseModel, withUUID()) {
  @column.dateTime()
  declare startDate: DateTime

  @column.dateTime()
  declare endDate: DateTime

  @column()
  declare status: ReservationStatus

  @column()
  declare sportEquipmentId: string

  @column()
  declare userId: string

  @column({
    prepare: (value: InvitedUser[]) => JSON.stringify(value || []),
    consume: (value: any) => {
      if (!value) return []
      if (Array.isArray(value)) return value
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch {
          return []
        }
      }
      return []
    },
  })
  declare invitedUsers: InvitedUser[]

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
