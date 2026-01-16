import { UserFactory } from '#users/factories/user_factory'
import User from '#users/models/user'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Auth - Register', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should register a new user successfully', async ({ client, assert }) => {
    const response = await client.post('/auth/register').json({
      email: 'newuser@test.com',
      password: 'password123',
      fullName: 'New User',
    })

    response.assertStatus(201)
    assert.exists(response.body().id)
    assert.equal(response.body().email, 'newuser@test.com')
    assert.equal(response.body().fullName, 'New User')
    // Password should not be returned
    assert.notExists(response.body().password)
  })

  test('should fail to register with invalid email', async ({ client }) => {
    const response = await client.post('/auth/register').json({
      email: 'invalid-email',
      password: 'password123',
      fullName: 'Test User',
    })

    response.assertStatus(422)
  })

  test('should fail to register with missing required fields', async ({ client }) => {
    const response = await client.post('/auth/register').json({
      email: 'test@test.com',
    })

    response.assertStatus(422)
  })

  test('should fail to register with duplicate email', async ({ client }) => {
    // Create a user first
    await UserFactory.merge({ email: 'existing@test.com' }).create()

    const response = await client.post('/auth/register').json({
      email: 'existing@test.com',
      password: 'password123',
      fullName: 'Duplicate User',
    })

    // Should fail due to unique constraint
    response.assertStatus(422)
  })
})

test.group('Auth - Login', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should login with valid credentials', async ({ client, assert }) => {
    // Create a user with a known password
    const user = await User.create({
      email: 'login@test.com',
      password: 'password123',
      fullName: 'Login User',
    })

    const response = await client.post('/auth/login').json({
      email: 'login@test.com',
      password: 'password123',
    })

    response.assertStatus(200)
    assert.equal(response.body().email, user.email)
  })

  test('should fail login with wrong password', async ({ client }) => {
    await User.create({
      email: 'wrongpass@test.com',
      password: 'correctpassword',
      fullName: 'Test User',
    })

    const response = await client.post('/auth/login').json({
      email: 'wrongpass@test.com',
      password: 'wrongpassword',
    })

    response.assertStatus(400)
  })

  test('should fail login with non-existent user', async ({ client }) => {
    const response = await client.post('/auth/login').json({
      email: 'nonexistent@test.com',
      password: 'password123',
    })

    response.assertStatus(400)
  })
})

test.group('Auth - Me', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should get current user when authenticated', async ({ client, assert }) => {
    const user = await UserFactory.create()

    const response = await client.get('/auth/me').withSession({ auth_web: user.id }).loginAs(user)

    response.assertStatus(200)
    assert.equal(response.body().email, user.email)
    assert.equal(response.body().fullName, user.fullName)
  })

  test('should fail to get current user when not authenticated', async ({ client }) => {
    const response = await client.get('/auth/me')

    response.assertStatus(401)
  })
})

test.group('Auth - Logout', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should logout successfully when authenticated', async ({ client }) => {
    const user = await UserFactory.create()

    const response = await client.post('/auth/logout').loginAs(user)

    response.assertStatus(204)
  })

  test('should fail to logout when not authenticated', async ({ client }) => {
    const response = await client.post('/auth/logout')

    response.assertStatus(401)
  })
})
