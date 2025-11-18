import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { withUUID } from '#common/mixins/with_uuid'
import { withTimestamps } from '#common/mixins/with_timestamps'
import { attachment, attachmentManager } from '@jrmc/adonis-attachment'
import { Attachment } from '@jrmc/adonis-attachment/types/attachment'
import SocialAccount from '#users/models/social_account'
import { type HasMany } from '@adonisjs/lucid/types/relations'

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

  @hasMany(() => SocialAccount)
  declare socialAccounts: HasMany<typeof SocialAccount>

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
