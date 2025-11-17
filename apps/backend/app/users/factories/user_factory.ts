import factory from '@adonisjs/lucid/factories'
import User from '#users/models/user'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      email: faker.internet.email(),
      password: '123',
      fullName: faker.person.fullName(),
    }
  })
  .build()
