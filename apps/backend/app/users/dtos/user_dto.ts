import { BaseModelDto } from '@adocasts.com/dto/base'
import User from '#users/models/user'
import SocialAccountDto from '#users/dtos/social_account'
import AttachmentDto from '#common/dtos/attachment_dto'

export default class UserDto extends BaseModelDto {
  declare id: string
  declare fullName: string
  declare email: string
  declare createdAt: string
  declare socialAccounts: SocialAccountDto[]
  declare avatar: AttachmentDto | null

  constructor(user?: User) {
    super()

    if (!user) return
    this.id = user.id
    this.fullName = user.fullName
    this.email = user.email
    this.createdAt = user.createdAt.toISODate()!
    this.socialAccounts = user.socialAccounts && SocialAccountDto.fromArray(user.socialAccounts)
    this.avatar = user.avatar && new AttachmentDto(user.avatar)
  }
}
