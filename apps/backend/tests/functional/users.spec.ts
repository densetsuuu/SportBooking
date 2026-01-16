import { UserFactory } from '#users/factories/user_factory'
import User from '#users/models/user'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Users - Show', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should get a user by id', async ({ client, assert }) => {
    const user = await UserFactory.create()

    const response = await client.get(`/users/${user.id}`)

    response.assertStatus(200)
    assert.equal(response.body().email, user.email)
    assert.equal(response.body().fullName, user.fullName)
    // Password should not be returned
    assert.notExists(response.body().password)
  })

  test('should return 404 for non-existent user', async ({ client }) => {
    const response = await client.get('/users/00000000-0000-0000-0000-000000000000')

    response.assertStatus(404)
  })
})

test.group('Users - Update', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should update own user profile', async ({ client, assert }) => {
    const user = await UserFactory.create()

    const response = await client
      .put(`/users/${user.id}`)
      .json({
        fullName: 'Updated Name',
      })
      .loginAs(user)

    response.assertStatus(200)
    assert.equal(response.body().fullName, 'Updated Name')
  })

  test('should fail to update another user profile', async ({ client }) => {
    const user = await UserFactory.create()
    const otherUser = await UserFactory.create()

    const response = await client
      .put(`/users/${otherUser.id}`)
      .json({
        fullName: 'Hacked Name',
      })
      .loginAs(user)

    response.assertStatus(403)
  })

  test('should fail to update user when not authenticated', async ({ client }) => {
    const user = await UserFactory.create()

    const response = await client.put(`/users/${user.id}`).json({
      fullName: 'Updated Name',
    })

    response.assertStatus(401)
  })
})

test.group('Users - Delete', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should delete own user account', async ({ client, assert }) => {
    const user = await UserFactory.create()

    const response = await client.delete(`/users/${user.id}`).loginAs(user)

    response.assertStatus(204)

    const deletedUser = await User.find(user.id)
    assert.isNull(deletedUser)
  })

  test('should fail to delete another user account', async ({ client }) => {
    const user = await UserFactory.create()
    const otherUser = await UserFactory.create()

    const response = await client.delete(`/users/${otherUser.id}`).loginAs(user)

    response.assertStatus(403)
  })

  test('should fail to delete user when not authenticated', async ({ client }) => {
    const user = await UserFactory.create()

    const response = await client.delete(`/users/${user.id}`)

    response.assertStatus(401)
  })
})
