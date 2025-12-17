import { withUUID } from '#common/mixins/with_uuid'
import Invitation from '#reservation/models/invitation'
import User from '#users/models/user'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { withStatuses } from '#common/mixins/with_status'

export const reservationStatuses = ['waiting', 'confirmed', 'cancelled'] as const
export type ReservationStatus = (typeof reservationStatuses)[number]

export default class Reservation extends compose(
  BaseModel,
  withUUID(),
  withStatuses(reservationStatuses)
) {
  @column.dateTime()
  declare startDate: DateTime

  @column.dateTime()
  declare endDate: DateTime

  @column()
  declare sportEquipmentId: string

  @column()
  declare userId: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Invitation)
  declare invitations: HasMany<typeof Invitation>
}
