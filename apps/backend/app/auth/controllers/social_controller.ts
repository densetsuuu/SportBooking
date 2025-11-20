import type { HttpContext } from '@adonisjs/core/http'

import User from '#users/models/user'
import env from '#start/env'
import { Delete, Get, Group, Middleware, Where } from '@adonisjs-community/girouette'
import { middleware } from '#start/kernel'
import { inject } from '@adonisjs/core'
import FileService from '#common/services/file_service'
import { SocialService } from '#users/services/social_service'
import UserPolicy from '#users/policies/user_policy'

const providers = ['google'] as const
type Provider = (typeof providers)[number]

@inject()
@Group({ name: 'auth.social', prefix: 'auth/social' })
export default class SocialController {
  constructor(
    private fileService: FileService,
    private socialService: SocialService
  ) {}

  @Get('/:provider/redirect', 'create')
  @Where('provider', /google/)
  async redirect({ ally, params }: HttpContext) {
    const driverInstance = ally.use(params.provider)

    return driverInstance.redirect()
  }

  @Get('/:provider/callback', 'callback')
  @Where('provider', /google/)
  async callback({ ally, auth, params, response, session }: HttpContext) {
    const social = ally.use(params.provider as Provider)

    if (social.accessDenied()) {
      session.flash('errors', 'auth.social.error.access_denied')

      return response.redirect().toPath(`${env.get('FRONTEND_URL')}/register`)
    }

    if (social.stateMisMatch()) {
      session.flash('errors', 'auth.social.error.state_mismatch')

      return response.redirect().toPath(`${env.get('FRONTEND_URL')}/register`)
    }

    if (social.hasError()) {
      session.flash('errors', 'auth.social.error.uknown')

      return response.redirect().toPath(`${env.get('FRONTEND_URL')}/register`)
    }

    const socialUser = await social.user()
    const user = await User.firstOrCreate(
      {
        email: socialUser.email,
      },
      {
        fullName: socialUser.name,
        email: socialUser.email,
        password: Math.random().toString(36).slice(-8),
        avatar: await this.fileService.fromUrl(socialUser.avatarUrl),
        avatarSource: params.provider,
      }
    )

    await this.socialService.addSocialAccount(user, params.provider, socialUser)
    await auth.use('web').login(user)

    return response.redirect().toPath(`${env.get('FRONTEND_URL')}/users/${user.id}`)
  }

  @Delete('/:provider', 'disconnect')
  @Where('provider', /google/)
  @Middleware(middleware.auth())
  async disconnect({ auth, params, response, bouncer }: HttpContext) {
    await bouncer.with(UserPolicy).authorize('update', auth.user!)

    await this.socialService.removeSocialAccount(auth.user!, params.provider)

    return response.noContent()
  }
}
