import type { HttpContext } from '@adonisjs/core/http'

import { Get, Group, Middleware, Post } from '@adonisjs-community/girouette'
import { loginValidator } from '#auth/validators/login'
import User from '#users/models/user'
import { middleware } from '#start/kernel'
import { inject } from '@adonisjs/core'
import UserDto from '#users/dtos/user_dto'

@inject()
@Group({ name: 'auth', prefix: '/auth' })
export default class AuthController {
  @Post('/login', 'login')
  async login({ auth, request }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)

    await auth.use('web').login(user)

    return user
  }

  @Get('/me', 'me')
  @Middleware([middleware.auth()])
  async me({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    await User.preComputeUrls(user)
    await user.load('socialAccounts')

    return new UserDto(user)
  }

  @Post('/logout', 'logout')
  @Middleware(middleware.auth())
  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()

    response.noContent()
  }
}
