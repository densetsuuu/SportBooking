import type { HttpContext } from '@adonisjs/core/http'

import { Get } from '@adonisjs-community/girouette'
import { inject } from '@adonisjs/core'
import User from '#users/models/user'
import UserDto from '#users/dtos/user_dto'

@inject()
export default class UserController {
  @Get('/users/:userId', 'users.show')
  async show({ params, response }: HttpContext) {
    const { userId } = params
    const user = await User.findOrFail(userId)

    return response.ok(new UserDto(user))
  }
}
