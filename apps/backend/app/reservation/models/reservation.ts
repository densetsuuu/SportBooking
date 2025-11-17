import { withUUID } from '#common/mixins/with_uuid'
import Invitation from '#reservation/models/invitation'
import User from '#users/models/user'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export const reservationStatus = ['waiting', 'confirmed', 'cancelled'] as const
export type ReservationStatus = (typeof reservationStatus)[number]

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

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Invitation)
  declare invitations: HasMany<typeof Invitation>
}
