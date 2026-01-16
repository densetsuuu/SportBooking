import { ReservationService } from '#reservation/services/reservation_service'
import { updateInvitationStatusValidator } from '#reservation/validators/reservation'
import { middleware } from '#start/kernel'
import { Get, Middleware, Patch } from '@adonisjs-community/girouette'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class SportEquipmentsReservationsController {
  constructor(private reservationService: ReservationService) {}

  @Patch('/reservations/:id/invitation', 'invitation.update.status')
  @Middleware(middleware.auth())
  async updateInvitationStatus({ params, request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const { id: reservationId } = params
    const { status } = await request.validateUsing(updateInvitationStatusValidator)

    const reservation = await this.reservationService.updateInvitationStatus(
      reservationId,
      user.id,
      status
    )

    return response.ok(reservation)
  }

  @Get('/users/:userId/reservations', 'getUserReservationsById')
  @Middleware(middleware.auth())
  async getUserReservationsById({ params, response }: HttpContext) {
    const { userId } = params

    const reservations = await this.reservationService.getUserReservations(userId)

    return response.ok(reservations)
  }
}
