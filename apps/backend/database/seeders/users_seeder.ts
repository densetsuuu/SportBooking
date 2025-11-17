import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { UserFactory } from '#users/factories/user_factory'

export default class extends BaseSeeder {
  async run() {
    await UserFactory.merge({
      email: 'john.doe@example.com',
      fullName: 'John Doe',
    }).create()
  }
}
