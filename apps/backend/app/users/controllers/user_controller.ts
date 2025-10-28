import type { HttpContext } from '@adonisjs/core/http'

import { Get, Group, Middleware, Put, Resource } from '@adonisjs-community/girouette'
import { middleware } from '#start/kernel'
import { inject } from '@adonisjs/core'
import User from '#users/models/user'
import UserDto from '#users/dtos/userDto'

@inject()
@Resource({ name: 'user', params: {user:'userId'} })
export default class UserController {
  @Put('/edit', 'edit')
  @Middleware([middleware.auth()])
  async me_edit({ auth }: HttpContext) {
    // TODO
  }

  async show({ params, response }: HttpContext) {
    const {userId} = params
    const user = await User.findOrFail(userId)
    console.log(user)

    return response.ok(new UserDto(user))
  }
}