import { withUUID } from '#common/mixins/with_uuid'
import Reservation from '#reservation/models/reservation'
import User from '#users/models/user'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export const invitationStatus = ['waiting', 'confirmed', 'refused'] as const
export type InvitationStatus = (typeof invitationStatus)[number]

export default class Invitation extends compose(BaseModel, withUUID()) {
  @column()
  declare status: InvitationStatus

  @column()
  declare userId: string

  @column()
  declare reservationId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Reservation)
  declare reservation: BelongsTo<typeof Reservation>
}
