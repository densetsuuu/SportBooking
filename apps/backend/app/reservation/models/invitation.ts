import { withUUID } from '#common/mixins/with_uuid'
import Reservation from '#reservation/models/reservation'
import User from '#users/models/user'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { withTimestamps } from '#common/mixins/with_timestamps'
import { withStatuses } from '#common/mixins/with_status'

export const invitationStatuses = ['waiting', 'confirmed', 'refused'] as const
export type InvitationStatus = (typeof invitationStatuses)[number]

export default class Invitation extends compose(
  BaseModel,
  withUUID(),
  withTimestamps(),
  withStatuses(invitationStatuses)
) {
  @column()
  declare userId: string

  @column()
  declare reservationId: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Reservation)
  declare reservation: BelongsTo<typeof Reservation>
}
