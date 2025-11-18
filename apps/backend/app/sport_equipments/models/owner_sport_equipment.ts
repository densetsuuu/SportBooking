import { withTimestamps } from '#common/mixins/with_timestamps'
import { withUUID } from '#common/mixins/with_uuid'
import User from '#users/models/user'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class OwnerSportEquipment extends compose(BaseModel, withUUID(), withTimestamps()) {
  static table = 'owner_sport_equipment'

  @column()
  declare ownerId: string

  @column()
  declare sportEquipmentId: string

  @belongsTo(() => User, {
    foreignKey: 'ownerId',
  })
  declare owner: BelongsTo<typeof User>
}
