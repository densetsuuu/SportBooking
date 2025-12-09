import FileService from '#common/services/file_service'
import User from '#users/models/user'
import { indexUsersValidator, updateUserValidator } from '#users/validators/user'
import { inject } from '@adonisjs/core'
import { omit } from '@julr/utils/object'
import { Infer } from '@vinejs/vine/types'

@inject()
export class UserService {
  constructor(private fileService: FileService) {}

  async deleteUser(user: User) {
    await user.delete()
  }

  async updateUser(user: User, payload: Infer<typeof updateUserValidator>) {
    if (payload.avatar !== undefined) {
      user.avatar = await this.fileService.uploadFile(payload.avatar)
    }

    const updatedUser = await user.merge(omit(payload, ['avatar'])).save()

    await User.preComputeUrls(updatedUser)

    return updatedUser
  }

  async searchUsers(query: Infer<typeof indexUsersValidator>) {
    const users = await User.query()
      .if(query.search, (q) =>
        q
          .where('email', 'ilike', `%${query.search}%`)
          .orWhere('fullName', 'ilike', `%${query.search}%`)
      )
      .limit(5)

    await User.preComputeUrls(users)

    return users
  }
}
