import { withTimestamps } from '#common/mixins/with_timestamps'
import { withUUID } from '#common/mixins/with_uuid'
import User from '#users/models/user'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { attachment } from '@jrmc/adonis-attachment'
import type { Attachment } from '@jrmc/adonis-attachment/types/attachment'

export default class OwnerSportEquipment extends compose(BaseModel, withUUID(), withTimestamps()) {
  static table = 'owner_sport_equipment'

  @column()
  declare ownerId: string

  @column()
  declare sportEquipmentId: string

  @column()
  declare phoneNumber: string | null

  @column()
  declare status: 'approved' | 'refused' | 'waiting'

  @attachment({ preComputeUrl: true })
  declare fileIdentification: Attachment | null

  @belongsTo(() => User, {
    foreignKey: 'ownerId',
  })
  declare owner: BelongsTo<typeof User>
}
