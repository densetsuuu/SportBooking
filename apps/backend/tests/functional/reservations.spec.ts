import Invitation from '#reservation/models/invitation'
import Reservation from '#reservation/models/reservation'
import { UserFactory } from '#users/factories/user_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import { DateTime } from 'luxon'

test.group('Reservations - Create', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should create a reservation successfully', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const startDate = DateTime.now().plus({ days: 1 })
    const endDate = startDate.plus({ hours: 2 })

    const response = await client
      .post('/reservations')
      .json({
        sportEquipmentId: 'EQUIP-001',
        startDate: startDate.toISO(),
        endDate: endDate.toISO(),
      })
      .loginAs(user)

    response.assertStatus(201)
    assert.exists(response.body().id)
    assert.equal(response.body().sportEquipmentId, 'EQUIP-001')
    assert.equal(response.body().status, 'confirmed')
  })

  test('should create a reservation with invitations', async ({ client, assert }) => {
    const creator = await UserFactory.create()
    const invitedUser = await UserFactory.create()
    const startDate = DateTime.now().plus({ days: 1 })
    const endDate = startDate.plus({ hours: 2 })

    const response = await client
      .post('/reservations')
      .json({
        sportEquipmentId: 'EQUIP-002',
        startDate: startDate.toISO(),
        endDate: endDate.toISO(),
        invitedUsers: [invitedUser.id],
      })
      .loginAs(creator)

    response.assertStatus(201)
    assert.equal(response.body().status, 'waiting')
    assert.lengthOf(response.body().invitations, 1)
    assert.equal(response.body().invitations[0].userId, invitedUser.id)
    assert.equal(response.body().invitations[0].status, 'waiting')
  })

  test('should fail to create reservation with end date before start date', async ({ client }) => {
    const user = await UserFactory.create()
    const startDate = DateTime.now().plus({ days: 2 })
    const endDate = DateTime.now().plus({ days: 1 })

    const response = await client
      .post('/reservations')
      .json({
        sportEquipmentId: 'EQUIP-003',
        startDate: startDate.toISO(),
        endDate: endDate.toISO(),
      })
      .loginAs(user)

    response.assertStatus(400)
  })

  test('should fail to create overlapping reservation', async ({ client }) => {
    const user1 = await UserFactory.create()
    const user2 = await UserFactory.create()
    const startDate = DateTime.now().plus({ days: 1 })
    const endDate = startDate.plus({ hours: 2 })

    // Create first reservation
    await Reservation.create({
      userId: user1.id,
      sportEquipmentId: 'EQUIP-OVERLAP',
      startDate: startDate,
      endDate: endDate,
      status: 'confirmed',
    })

    // Try to create overlapping reservation
    const response = await client
      .post('/reservations')
      .json({
        sportEquipmentId: 'EQUIP-OVERLAP',
        startDate: startDate.plus({ minutes: 30 }).toISO(),
        endDate: endDate.plus({ minutes: 30 }).toISO(),
      })
      .loginAs(user2)

    response.assertStatus(409)
  })

  test('should fail to create reservation when not authenticated', async ({ client }) => {
    const startDate = DateTime.now().plus({ days: 1 })
    const endDate = startDate.plus({ hours: 2 })

    const response = await client.post('/reservations').json({
      sportEquipmentId: 'EQUIP-004',
      startDate: startDate.toISO(),
      endDate: endDate.toISO(),
    })

    response.assertStatus(401)
  })
})

test.group('Reservations - List', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should list all reservations', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const startDate = DateTime.now().plus({ days: 1 })

    await Reservation.create({
      userId: user.id,
      sportEquipmentId: 'EQUIP-LIST-001',
      startDate: startDate,
      endDate: startDate.plus({ hours: 1 }),
      status: 'confirmed',
    })

    await Reservation.create({
      userId: user.id,
      sportEquipmentId: 'EQUIP-LIST-002',
      startDate: startDate.plus({ hours: 2 }),
      endDate: startDate.plus({ hours: 3 }),
      status: 'waiting',
    })

    const response = await client.get('/reservations').loginAs(user)

    response.assertStatus(200)
    assert.isArray(response.body())
    assert.isAtLeast(response.body().length, 2)
  })

  test('should filter reservations by sport equipment id', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const startDate = DateTime.now().plus({ days: 1 })

    await Reservation.create({
      userId: user.id,
      sportEquipmentId: 'EQUIP-FILTER-A',
      startDate: startDate,
      endDate: startDate.plus({ hours: 1 }),
      status: 'confirmed',
    })

    await Reservation.create({
      userId: user.id,
      sportEquipmentId: 'EQUIP-FILTER-B',
      startDate: startDate.plus({ hours: 2 }),
      endDate: startDate.plus({ hours: 3 }),
      status: 'confirmed',
    })

    const response = await client.get('/reservations?sportEquipmentId=EQUIP-FILTER-A').loginAs(user)

    response.assertStatus(200)
    assert.isArray(response.body())
    response.body().forEach((res: any) => {
      assert.equal(res.sportEquipmentId, 'EQUIP-FILTER-A')
    })
  })

  test('should filter reservations by status', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const startDate = DateTime.now().plus({ days: 1 })

    await Reservation.create({
      userId: user.id,
      sportEquipmentId: 'EQUIP-STATUS-A',
      startDate: startDate,
      endDate: startDate.plus({ hours: 1 }),
      status: 'confirmed',
    })

    await Reservation.create({
      userId: user.id,
      sportEquipmentId: 'EQUIP-STATUS-B',
      startDate: startDate.plus({ hours: 2 }),
      endDate: startDate.plus({ hours: 3 }),
      status: 'cancelled',
    })

    const response = await client.get('/reservations?status=confirmed').loginAs(user)

    response.assertStatus(200)
    response.body().forEach((res: any) => {
      assert.equal(res.status, 'confirmed')
    })
  })
})

test.group('Reservations - Show', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should get a specific reservation by id', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const startDate = DateTime.now().plus({ days: 1 })

    const reservation = await Reservation.create({
      userId: user.id,
      sportEquipmentId: 'EQUIP-SHOW',
      startDate: startDate,
      endDate: startDate.plus({ hours: 1 }),
      status: 'confirmed',
    })

    const response = await client.get(`/reservations/${reservation.id}`).loginAs(user)

    response.assertStatus(200)
    assert.equal(response.body().id, reservation.id)
    assert.equal(response.body().sportEquipmentId, 'EQUIP-SHOW')
  })

  test('should return 404 for non-existent reservation', async ({ client }) => {
    const user = await UserFactory.create()

    const response = await client
      .get('/reservations/00000000-0000-0000-0000-000000000000')
      .loginAs(user)

    response.assertStatus(404)
  })
})

test.group('Reservations - Cancel', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should cancel a reservation by owner', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const startDate = DateTime.now().plus({ days: 1 })

    const reservation = await Reservation.create({
      userId: user.id,
      sportEquipmentId: 'EQUIP-CANCEL',
      startDate: startDate,
      endDate: startDate.plus({ hours: 1 }),
      status: 'confirmed',
    })

    const response = await client.delete(`/reservations/${reservation.id}`).loginAs(user)

    response.assertStatus(200)
    assert.equal(response.body().status, 'cancelled')
  })

  test('should fail to cancel reservation owned by another user', async ({ client }) => {
    const owner = await UserFactory.create()
    const otherUser = await UserFactory.create()
    const startDate = DateTime.now().plus({ days: 1 })

    const reservation = await Reservation.create({
      userId: owner.id,
      sportEquipmentId: 'EQUIP-CANCEL-OTHER',
      startDate: startDate,
      endDate: startDate.plus({ hours: 1 }),
      status: 'confirmed',
    })

    const response = await client.delete(`/reservations/${reservation.id}`).loginAs(otherUser)

    response.assertStatus(403)
  })

  test('should fail to cancel already cancelled reservation', async ({ client }) => {
    const user = await UserFactory.create()
    const startDate = DateTime.now().plus({ days: 1 })

    const reservation = await Reservation.create({
      userId: user.id,
      sportEquipmentId: 'EQUIP-ALREADY-CANCELLED',
      startDate: startDate,
      endDate: startDate.plus({ hours: 1 }),
      status: 'cancelled',
    })

    const response = await client.delete(`/reservations/${reservation.id}`).loginAs(user)

    response.assertStatus(400)
  })
})

test.group('Reservations - Invitations', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should update invitation status to confirmed', async ({ client, assert }) => {
    const creator = await UserFactory.create()
    const invitedUser = await UserFactory.create()
    const startDate = DateTime.now().plus({ days: 1 })

    const reservation = await Reservation.create({
      userId: creator.id,
      sportEquipmentId: 'EQUIP-INV-CONFIRM',
      startDate: startDate,
      endDate: startDate.plus({ hours: 1 }),
      status: 'waiting',
    })

    await Invitation.create({
      userId: invitedUser.id,
      reservationId: reservation.id,
      status: 'waiting',
    })

    const response = await client
      .patch(`/reservations/${reservation.id}/invitation`)
      .json({ status: 'confirmed' })
      .loginAs(invitedUser)

    response.assertStatus(200)

    const updatedInvitation = await Invitation.query()
      .where('reservationId', reservation.id)
      .where('userId', invitedUser.id)
      .firstOrFail()

    assert.equal(updatedInvitation.status, 'confirmed')
  })

  test('should update invitation status to refused', async ({ client, assert }) => {
    const creator = await UserFactory.create()
    const invitedUser = await UserFactory.create()
    const startDate = DateTime.now().plus({ days: 1 })

    const reservation = await Reservation.create({
      userId: creator.id,
      sportEquipmentId: 'EQUIP-INV-REFUSE',
      startDate: startDate,
      endDate: startDate.plus({ hours: 1 }),
      status: 'waiting',
    })

    await Invitation.create({
      userId: invitedUser.id,
      reservationId: reservation.id,
      status: 'waiting',
    })

    const response = await client
      .patch(`/reservations/${reservation.id}/invitation`)
      .json({ status: 'refused' })
      .loginAs(invitedUser)

    response.assertStatus(200)

    const updatedInvitation = await Invitation.query()
      .where('reservationId', reservation.id)
      .where('userId', invitedUser.id)
      .firstOrFail()

    assert.equal(updatedInvitation.status, 'refused')
  })

  test('should auto-validate reservation when all invitations answered', async ({
    client,
    assert,
  }) => {
    const creator = await UserFactory.create()
    const invitedUser = await UserFactory.create()
    const startDate = DateTime.now().plus({ days: 1 })

    const reservation = await Reservation.create({
      userId: creator.id,
      sportEquipmentId: 'EQUIP-AUTO-VALIDATE',
      startDate: startDate,
      endDate: startDate.plus({ hours: 1 }),
      status: 'waiting',
    })

    await Invitation.create({
      userId: invitedUser.id,
      reservationId: reservation.id,
      status: 'waiting',
    })

    // Answer the invitation
    await client
      .patch(`/reservations/${reservation.id}/invitation`)
      .json({ status: 'confirmed' })
      .loginAs(invitedUser)

    // Check reservation status was auto-validated
    const updatedReservation = await Reservation.findOrFail(reservation.id)
    assert.equal(updatedReservation.status, 'confirmed')
  })

  test('should fail to update invitation for non-invited user', async ({ client }) => {
    const creator = await UserFactory.create()
    const notInvitedUser = await UserFactory.create()
    const startDate = DateTime.now().plus({ days: 1 })

    const reservation = await Reservation.create({
      userId: creator.id,
      sportEquipmentId: 'EQUIP-NOT-INVITED',
      startDate: startDate,
      endDate: startDate.plus({ hours: 1 }),
      status: 'waiting',
    })

    const response = await client
      .patch(`/reservations/${reservation.id}/invitation`)
      .json({ status: 'confirmed' })
      .loginAs(notInvitedUser)

    response.assertStatus(403)
  })
})

test.group('Reservations - User Reservations', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should get user reservations including accepted invitations', async ({
    client,
    assert,
  }) => {
    const user = await UserFactory.create()
    const otherUser = await UserFactory.create()
    const startDate = DateTime.now().plus({ days: 1 })

    // User's own reservation
    await Reservation.create({
      userId: user.id,
      sportEquipmentId: 'EQUIP-OWN',
      startDate: startDate,
      endDate: startDate.plus({ hours: 1 }),
      status: 'confirmed',
    })

    // Other user's reservation where user is invited and accepted
    const otherReservation = await Reservation.create({
      userId: otherUser.id,
      sportEquipmentId: 'EQUIP-INVITED',
      startDate: startDate.plus({ hours: 2 }),
      endDate: startDate.plus({ hours: 3 }),
      status: 'confirmed',
    })

    await Invitation.create({
      userId: user.id,
      reservationId: otherReservation.id,
      status: 'confirmed',
    })

    const response = await client.get(`/users/${user.id}/reservations`).loginAs(user)

    response.assertStatus(200)
    assert.isArray(response.body())
    assert.lengthOf(response.body(), 2)
  })
})
