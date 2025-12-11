import { withTimestamps } from '#common/mixins/with_timestamps'
import { withUUID } from '#common/mixins/with_uuid'
import OwnerSportEquipment from '#sport_equipments/models/owner_sport_equipment'
import SocialAccount from '#users/models/social_account'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { type HasMany } from '@adonisjs/lucid/types/relations'
import { attachment, attachmentManager } from '@jrmc/adonis-attachment'
import { Attachment } from '@jrmc/adonis-attachment/types/attachment'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder, withUUID(), withTimestamps()) {
  @attachment({ folder: `users/:id/avatar` })
  declare avatar: Attachment | null

  @column()
  declare avatarSource: string | null

  @column()
  declare fullName: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare type: 'admin' | 'classic'

  @hasMany(() => SocialAccount)
  declare socialAccounts: HasMany<typeof SocialAccount>

  @hasMany(() => OwnerSportEquipment, {
    foreignKey: 'ownerId',
  })
  declare ownedSportEquipments: HasMany<typeof OwnerSportEquipment>

  static async preComputeUrls(models: User | User[]) {
    if (Array.isArray(models)) {
      await Promise.all(models.map((model) => this.preComputeUrls(model)))
      return
    }

    if (models.avatar) {
      await attachmentManager.computeUrl(models.avatar)
    }
  }
}
