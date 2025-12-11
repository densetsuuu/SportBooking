import AttachmentDto from '#common/dtos/attachment_dto'
import SocialAccountDto from '#users/dtos/social_account'
import User from '#users/models/user'
import { BaseModelDto } from '@adocasts.com/dto/base'

export default class UserDto extends BaseModelDto {
  declare id: string
  declare fullName: string
  declare email: string
  declare type: 'admin' | 'classic'
  declare createdAt: string
  declare socialAccounts: SocialAccountDto[]
  declare avatar: AttachmentDto | null

  constructor(user?: User) {
    super()

    if (!user) return
    this.id = user.id
    this.fullName = user.fullName
    this.email = user.email
    this.type = user.type
    this.createdAt = user.createdAt.toISODate()!
    this.socialAccounts = user.socialAccounts && SocialAccountDto.fromArray(user.socialAccounts)
    this.avatar = user.avatar && new AttachmentDto(user.avatar)
  }
}
