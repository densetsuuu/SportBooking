import type { HttpContext } from '@adonisjs/core/http'

import { middleware } from '#start/kernel'
import UserDto from '#users/dtos/user_dto'
import User from '#users/models/user'
import UserPolicy from '#users/policies/user_policy'
import { UserService } from '#users/services/user_service'
import { indexUsersValidator, updateUserValidator } from '#users/validators/user'
import { Only, Resource, ResourceMiddleware } from '@adonisjs-community/girouette'
import { inject } from '@adonisjs/core'

@inject()
@Resource({ name: 'users', params: { users: 'userId' } })
@ResourceMiddleware(['update', 'destroy'], middleware.auth())
@Only(['index', 'show', 'destroy', 'update'])
export default class UserController {
  constructor(private userService: UserService) {}

  async show({ params, response }: HttpContext) {
    const { userId } = params
    const user = await User.findOrFail(userId)
    await User.preComputeUrls(user)

    return response.ok(new UserDto(user))
  }

  async update({ params, request, response, bouncer }: HttpContext) {
    const { userId } = params
    const payload = await request.validateUsing(updateUserValidator)
    const user = await User.findOrFail(userId)

    await bouncer.with(UserPolicy).authorize('update', user)

    const result = await this.userService.updateUser(user, payload)
    return response.ok(new UserDto(result))
  }

  async destroy({ params, response, bouncer }: HttpContext) {
    const { userId } = params
    const user = await User.findOrFail(userId)

    await bouncer.with(UserPolicy).authorize('destroy', user)

    await this.userService.deleteUser(user)
    return response.noContent()
  }

  async index({ request, response }: HttpContext) {
    const payload = await request.validateUsing(indexUsersValidator)

    const users = await this.userService.searchUsers(payload)
    return response.ok(users.map((user) => new UserDto(user)))
  }
}
