import type { HttpContext } from '@adonisjs/core/http'

import { Group, Post } from '@adonisjs-community/girouette'
import { registerValidator } from '#auth/validators/register'
import User from '#users/models/user'

@Group({ name: 'auth', prefix: '/auth' })
export default class RegistersController {
  @Post('/register', 'register')
  async register({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    const user = await User.create(data)

    await auth.use('web').login(user)

    return response.created(user)
  }
}
