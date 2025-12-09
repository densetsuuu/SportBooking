import User from '#users/models/user'
import { updateUserValidator } from '#users/validators/user'
import { Infer } from '@vinejs/vine/types'
import FileService from '#common/services/file_service'
import { inject } from '@adonisjs/core'
import { omit } from '@julr/utils/object'

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
}
