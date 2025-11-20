import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { withTimestamps } from '#common/mixins/with_timestamps'
import User from '#users/models/user'
import type { GoogleToken } from '@adonisjs/ally/types'

export default class SocialAccount extends compose(BaseModel, withTimestamps()) {
  @column({ isPrimary: true })
  declare id: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column({
    prepare: (value) => JSON.stringify(value),
  })
  declare token: GoogleToken

  @column()
  declare userId: string

  @column()
  declare providerName: string

  @column()
  declare email: string | null

  @column()
  declare username: string

  @column({
    prepare: (value: Record<string, any>) => JSON.stringify(value),
  })
  declare providerData: Record<string, any> | null
}
