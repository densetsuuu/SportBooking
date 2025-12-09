import User from '#users/models/user'
import { BasePolicy } from '@adonisjs/bouncer'

export default class UserPolicy extends BasePolicy {
  async destroy(user: User, target: User) {
    return user.id === target.id
  }

  async update(user: User, target: User) {
    return user.id === target.id
  }
}
