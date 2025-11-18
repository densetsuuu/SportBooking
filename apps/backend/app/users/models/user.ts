import { withTimestamps } from '#common/mixins/with_timestamps'
import { withUUID } from '#common/mixins/with_uuid'
import OwnerSportEquipment from '#sport_equipments/models/owner_sport_equipment'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder, withUUID(), withTimestamps()) {
  @column()
  declare fullName: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @hasMany(() => OwnerSportEquipment, {
    foreignKey: 'ownerId',
  })
  declare ownedSportEquipments: HasMany<typeof OwnerSportEquipment>
}
