import { ReservationService } from '#reservation/services/reservation_service'
import {
  createReservationValidator,
  indexReservationsValidator,
  updateInvitationStatusValidator,
  updateReservationStatusValidator,
} from '#reservation/validators/reservation'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ReservationsController {
  constructor(private reservationService: ReservationService) {}

  /**
   * Create a new reservation
   */
  async store({ request, response, auth }: HttpContext) {
    await auth.check()
    const user = auth.user!

    const payload = await request.validateUsing(createReservationValidator)

    const reservation = await this.reservationService.createReservation(user.id, payload)

    return response.created(reservation)
  }

  async storee({ request, response }: HttpContext) {
    const user = {
      id: '5b4c20aa-080a-45bf-b806-88f7de743504', // Example user ID
    }
    const payload = await request.validateUsing(createReservationValidator)
    const reservation = await this.reservationService.createReservation(user.id, payload)
    return response.created(reservation)
  }

  /**
   * Get all reservations with optional filters
   * Query params: sportEquipmentId, status
   */
  async index({ request, response }: HttpContext) {
    const payload = await request.validateUsing(indexReservationsValidator)

    const reservations = await this.reservationService.getReservations(payload)

    return response.ok(reservations)
  }

  /**
   * Get a specific reservation by ID
   */
  async show({ params, response }: HttpContext) {
    const { id } = params

    const reservation = await this.reservationService.getReservationById(id)

    return response.ok(reservation)
  }

  /**
   * Cancel a reservation (user can cancel their own reservation)
   */
  async destroy({ params, response, auth }: HttpContext) {
    await auth.check()
    const user = auth.user!
    const { id } = params

    const reservation = await this.reservationService.cancelReservation(id, user.id)

    return response.ok(reservation)
  }

  /**
   * Update reservation status (for admin/owner)
   */
  async updateStatus({ params, request, response }: HttpContext) {
    const { id } = params
    const { status } = await request.validateUsing(updateReservationStatusValidator)

    const reservation = await this.reservationService.updateReservationStatus(id, status)

    return response.ok(reservation)
  }

  /**
   * Get all reservations for a specific sport equipment
   */
  async getByEquipment({ params, response }: HttpContext) {
    const { equip_numero: equipNumero } = params

    const reservations = await this.reservationService.getReservations({
      sportEquipmentId: equipNumero,
    })

    return response.ok(reservations)
  }

  /**
   * Update invitation status (invited user accepts or refuses)
   */
  async updateInvitationStatus({ params, request, response, auth }: HttpContext) {
    await auth.check()
    const user = auth.user!
    const { id: reservationId } = params
    const { status } = await request.validateUsing(updateInvitationStatusValidator)

    const reservation = await this.reservationService.updateInvitationStatus(
      reservationId,
      user.id,
      status
    )

    return response.ok(reservation)
  }

  /**
   * Get all reservations for the authenticated user (including all invitations: waiting, refused, confirmed)
   */
  async getUserReservations({ response, auth }: HttpContext) {
    await auth.check()
    const user = auth.user!

    const reservations = await this.reservationService.getUserAllReservations(user.id)

    return response.ok(reservations)
  }

  /**
   * Get all reservations for a specific user by ID (public - only created + accepted)
   */
  async getUserReservationsById({ params, response }: HttpContext) {
    const { userId } = params

    const reservations = await this.reservationService.getUserReservations(userId)

    return response.ok(reservations)
  }

  /**
   * Cancel waiting invitations for reservations that have started (can be called manually or by a cron job)
   */
  async cleanupStartedReservations({ response }: HttpContext) {
    const cancelledCount =
      await this.reservationService.cancelWaitingInvitationsForStartedReservations()

    return response.ok({
      message: `${cancelledCount} waiting invitation(s) cancelled for started reservations`,
      cancelledCount,
    })
  }
}
