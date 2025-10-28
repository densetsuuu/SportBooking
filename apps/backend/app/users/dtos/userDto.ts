import { BaseModelDto } from '@adocasts.com/dto/base'
import User from '#users/models/user'

export default class UserDto extends BaseModelDto {
  declare id: string
  declare firstName: string | null
  declare lastName: string | null
  declare email: string
  declare role: string

  constructor(user: User | null) {
    super()

    if (!user) return
    this.id = user.id
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.email = user.email
    this.role = user.role
  }
}