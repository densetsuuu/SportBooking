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
    try {
      await auth.check()
      const user = auth.user!

      const payload = await request.validateUsing(createReservationValidator)

      const reservation = await this.reservationService.createReservation(user.id, payload)

      return response.created(reservation)
    } catch (error) {
      if (error.status === 400 || error.status === 409) {
        return response.status(error.status).json({ message: error.message })
      }
      return response.internalServerError({
        message: 'Failed to create reservation',
        error: error.message,
      })
    }
  }

  async storee({ request, response }: HttpContext) {
    try {
      const user = {
        id: '5b4c20aa-080a-45bf-b806-88f7de743504', // Example user ID
      }
      const payload = await request.validateUsing(createReservationValidator)
      const reservation = await this.reservationService.createReservation(user.id, payload)
      return response.created(reservation)
    } catch (error) {
      if (error.status === 400 || error.status === 409) {
        return response.status(error.status).json({ message: error.message })
      }
      return response.internalServerError({
        message: 'Failed to create reservation',
        error: error.message,
      })
    }
  }

  /**
   * Get all reservations with optional filters
   * Query params: sportEquipmentId, status
   */
  async index({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(indexReservationsValidator)

      const reservations = await this.reservationService.getReservations(payload)

      return response.ok(reservations)
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch reservations',
        error: error.message,
      })
    }
  }

  /**
   * Get a specific reservation by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const { id } = params

      const reservation = await this.reservationService.getReservationById(id)

      return response.ok(reservation)
    } catch (error) {
      if (error.status === 404) {
        return response.notFound({ message: error.message })
      }
      return response.internalServerError({
        message: 'Failed to fetch reservation',
        error: error.message,
      })
    }
  }

  /**
   * Cancel a reservation (user can cancel their own reservation)
   */
  async destroy({ params, response, auth }: HttpContext) {
    try {
      await auth.check()
      const user = auth.user!
      const { id } = params

      const reservation = await this.reservationService.cancelReservation(id, user.id)

      return response.ok(reservation)
    } catch (error) {
      if (error.status === 404) {
        return response.notFound({ message: error.message })
      }
      if (error.status === 403) {
        return response.forbidden({ message: error.message })
      }
      if (error.status === 400) {
        return response.badRequest({ message: error.message })
      }
      return response.internalServerError({
        message: 'Failed to cancel reservation',
        error: error.message,
      })
    }
  }

  /**
   * Update reservation status (for admin/owner)
   */
  async updateStatus({ params, request, response }: HttpContext) {
    try {
      const { id } = params
      const { status } = await request.validateUsing(updateReservationStatusValidator)

      const reservation = await this.reservationService.updateReservationStatus(id, status)

      return response.ok(reservation)
    } catch (error) {
      if (error.status === 404) {
        return response.notFound({ message: error.message })
      }
      return response.internalServerError({
        message: 'Failed to update reservation status',
        error: error.message,
      })
    }
  }

  /**
   * Get all reservations for a specific sport equipment
   */
  async getByEquipment({ params, response }: HttpContext) {
    try {
      const { equip_numero: equipNumero } = params

      const reservations = await this.reservationService.getReservations({
        sportEquipmentId: equipNumero,
      })

      return response.ok(reservations)
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch reservations for equipment',
        error: error.message,
      })
    }
  }

  /**
   * Update invitation status (invited user accepts or refuses)
   */
  async updateInvitationStatus({ params, request, response, auth }: HttpContext) {
    try {
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
    } catch (error) {
      if (error.status === 404) {
        return response.notFound({ message: error.message })
      }
      if (error.status === 403) {
        return response.forbidden({ message: error.message })
      }
      return response.internalServerError({
        message: 'Failed to update invitation status',
        error: error.message,
      })
    }
  }
}
