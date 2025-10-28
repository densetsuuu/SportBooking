import Invitation, { InvitationStatus } from '#models/invitation'
import Reservation, { ReservationStatus } from '#models/reservation'
import {
  createReservationValidator,
  indexReservationsValidator,
} from '#reservation/validators/reservation'
import { Exception } from '@adonisjs/core/exceptions'
import { Infer } from '@vinejs/vine/types'

export class ReservationService {
  /**
   * Create a new reservation
   */
  async createReservation(
    userId: string,
    data: Infer<typeof createReservationValidator>
  ): Promise<Reservation> {
    // Validate that end date is after start date
    if (data.endDate <= data.startDate) {
      throw new Exception('End date must be after start date', { status: 400 })
    }

    // Check for overlapping reservations
    const overlappingReservation = await Reservation.query()
      .where('sport_equipment_id', data.sportEquipmentId)
      .whereNot('status', 'cancelled')

      // Cas 1 : Détecte si le début de la nouvelle réservation tombe dans un créneau occupé
      // Cas 2 : Détecte si la fin de la nouvelle réservation tombe dans un créneau occupé
      // Cas 3 : Détecte si la nouvelle réservation recouvre totalement un créneau existant
      .where((query) => {
        query
          .where((subQuery) => {
            subQuery
              .where('start_date', '<=', data.startDate.toSQL())
              .where('end_date', '>', data.startDate.toSQL())
          })
          .orWhere((subQuery) => {
            subQuery
              .where('start_date', '<', data.endDate.toSQL())
              .where('end_date', '>=', data.endDate.toSQL())
          })
          .orWhere((subQuery) => {
            subQuery
              .where('start_date', '>=', data.startDate.toSQL())
              .where('end_date', '<=', data.endDate.toSQL())
          })
      })
      .first()

    if (overlappingReservation) {
      throw new Exception('This time slot is already reserved', { status: 409 })
    }

    const reservation = await Reservation.create({
      userId,
      sportEquipmentId: data.sportEquipmentId,
      startDate: data.startDate,
      endDate: data.endDate,
      status: 'waiting',
    })

    // Create invitations for invited users
    if (data.invitedUsers && data.invitedUsers.length > 0) {
      const invitations = data.invitedUsers.map((invitedUserId) => ({
        userId: invitedUserId,
        reservationId: reservation.id,
        status: 'waiting' as const,
      }))
      await Invitation.createMany(invitations)
    }

    await reservation.load('user')
    await reservation.load('invitations', (query) => {
      query.preload('user')
    })
    return reservation
  }

  /**
   * Get reservations with optional filters
   */
  async getReservations(filters: Infer<typeof indexReservationsValidator>): Promise<Reservation[]> {
    const query = Reservation.query()
      .preload('user')
      .preload('invitations', (invitationQuery) => {
        invitationQuery.preload('user')
      })

    if (filters.sportEquipmentId) {
      query.where('sport_equipment_id', filters.sportEquipmentId)
    }

    if (filters.status) {
      query.where('status', filters.status)
    }

    query.orderBy('start_date', 'asc')

    return query
  }

  /**
   * Get a specific reservation by ID
   */
  async getReservationById(id: string): Promise<Reservation> {
    const reservation = await Reservation.query()
      .where('id', id)
      .preload('user')
      .preload('invitations', (invitationQuery) => {
        invitationQuery.preload('user')
      })
      .first()

    if (!reservation) {
      throw new Exception('Reservation not found', { status: 404 })
    }

    return reservation
  }

  /**
   * Cancel a reservation
   */
  async cancelReservation(id: string, userId: string): Promise<Reservation> {
    const reservation = await Reservation.find(id)

    if (!reservation) {
      throw new Exception('Reservation not found', { status: 404 })
    }

    // Check if user owns the reservation
    if (reservation.userId !== userId) {
      throw new Exception('You are not allowed to cancel this reservation', { status: 403 })
    }

    // Check if reservation is already cancelled
    if (reservation.status === 'cancelled') {
      throw new Exception('Reservation is already cancelled', { status: 400 })
    }

    reservation.status = 'cancelled'
    await reservation.save()
    await reservation.load('user')

    return reservation
  }

  /**
   * Update reservation status (for admin/owner)
   */
  async updateReservationStatus(id: string, status: ReservationStatus): Promise<Reservation> {
    const reservation = await Reservation.find(id)

    if (!reservation) {
      throw new Exception('Reservation not found', { status: 404 })
    }

    reservation.status = status
    await reservation.save()
    await reservation.load('user')

    return reservation
  }

  /**
   * Update invitation status for an invited user
   */
  async updateInvitationStatus(
    reservationId: string,
    userId: string,
    invitationStatus: InvitationStatus
  ): Promise<Reservation> {
    const reservation = await Reservation.find(reservationId)

    if (!reservation) {
      throw new Exception('Reservation not found', { status: 404 })
    }

    // Find the invitation
    const invitation = await Invitation.query()
      .where('reservation_id', reservationId)
      .where('user_id', userId)
      .first()

    if (!invitation) {
      throw new Exception('You are not invited to this reservation', { status: 403 })
    }

    // Update the invitation status
    invitation.status = invitationStatus
    await invitation.save()

    await reservation.load('user')
    await reservation.load('invitations', (query) => {
      query.preload('user')
    })

    return reservation
  }

  /**
   * Get all reservations for a specific user (created by user + accepted invitations)
   * Public view: only shows created reservations and accepted invitations
   */
  async getUserReservations(userId: string): Promise<Reservation[]> {
    // Get reservations created by the user
    const createdReservations = await Reservation.query()
      .where('user_id', userId)
      .preload('user')
      .preload('invitations', (invitationQuery) => {
        invitationQuery.preload('user')
      })
      .orderBy('start_date', 'asc')

    // Get reservations where user has ACCEPTED the invitation (confirmed status)
    const acceptedInvitations = await Invitation.query()
      .where('user_id', userId)
      .where('status', 'confirmed')
      .preload('reservation', (reservationQuery) => {
        reservationQuery.preload('user').preload('invitations', (invitationQuery) => {
          invitationQuery.preload('user')
        })
      })

    const acceptedReservations = acceptedInvitations.map((invitation) => invitation.reservation)

    // Combine and deduplicate (in case user created and is also invited to same reservation)
    const allReservations = [...createdReservations, ...acceptedReservations]
    const uniqueReservations = allReservations.filter(
      (reservation, index, self) => index === self.findIndex((r) => r.id === reservation.id)
    )

    // Sort by start date
    uniqueReservations.sort((a, b) => a.startDate.toMillis() - b.startDate.toMillis())

    return uniqueReservations
  }

  /**
   * Get ALL reservations for a specific user (including waiting, refused, etc.)
   * Private view: shows all reservations regardless of invitation status
   */
  async getUserAllReservations(userId: string): Promise<Reservation[]> {
    // Get reservations created by the user
    const createdReservations = await Reservation.query()
      .where('user_id', userId)
      .preload('user')
      .preload('invitations', (invitationQuery) => {
        invitationQuery.preload('user')
      })
      .orderBy('start_date', 'asc')

    // Get ALL reservations where user is invited (any status: waiting, confirmed, refused)
    const allInvitations = await Invitation.query()
      .where('user_id', userId)
      .preload('reservation', (reservationQuery) => {
        reservationQuery.preload('user').preload('invitations', (invitationQuery) => {
          invitationQuery.preload('user')
        })
      })

    const invitedReservations = allInvitations.map((invitation) => invitation.reservation)

    // Combine and deduplicate
    const allReservations = [...createdReservations, ...invitedReservations]
    const uniqueReservations = allReservations.filter(
      (reservation, index, self) => index === self.findIndex((r) => r.id === reservation.id)
    )

    // Sort by start date
    uniqueReservations.sort((a, b) => a.startDate.toMillis() - b.startDate.toMillis())

    return uniqueReservations
  }
}
