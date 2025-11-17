import { BaseModelDto } from '@adocasts.com/dto/base'
import User from '#users/models/user'

export default class UserDto extends BaseModelDto {
  declare id: string
  declare fullName: string
  declare email: string

  constructor(user?: User) {
    super()

    if (!user) return
    this.id = user.id
    this.fullName = user.fullName
    this.email = user.email
  }
}
