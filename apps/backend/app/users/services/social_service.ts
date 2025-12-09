import User from '#users/models/user'
import SocialAccount from '#users/models/social_account'
import { Exception } from '@adonisjs/core/exceptions'
import { AllyUserContract, GoogleToken } from '@adonisjs/ally/types'

export class SocialService {
  async addSocialAccount(user: User, provider: string, socialUser: AllyUserContract<GoogleToken>) {
    if (await SocialAccount.query().where({ userId: user.id, providerName: provider }).first()) {
      throw new Exception('Social account already linked', { status: 409 })
    }

    return await SocialAccount.create({
      userId: user.id,
      id: socialUser.id,
      email: socialUser.email,
      username: socialUser.nickName,
      providerName: provider,
      token: socialUser.token,
    })
  }

  async removeSocialAccount(user: User, provider: string) {
    const socialAccount = await SocialAccount.query()
      .where({ userId: user.id, providerName: provider })
      .first()

    if (!socialAccount) {
      throw new Exception('Social account not found', { status: 404 })
    }

    // Reset avatar if it came from the provider being removed
    if (user.avatarSource === provider) {
      user.avatar = null
      user.avatarSource = null
      await user.save()
    }

    await socialAccount.delete()
  }
}
