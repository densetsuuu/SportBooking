import { BaseModelDto } from '@adocasts.com/dto/base'
import SocialAccount from '#users/models/social_account'

export default class SocialAccountDto extends BaseModelDto {
  declare id: string
  declare username: string
  declare provider: string
  declare email: string | null
  declare createdAt: string

  constructor(socialAccount?: SocialAccount) {
    super()

    if (!socialAccount) return
    this.id = socialAccount.id
    this.username = socialAccount.username
    this.provider = socialAccount.providerName
    this.email = socialAccount.email
    this.createdAt = socialAccount.createdAt.toISODate()!
  }
}
