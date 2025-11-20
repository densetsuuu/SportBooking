import { ReservationService } from '#reservation/services/reservation_service'
import {
  createReservationValidator,
  indexReservationsValidator,
  updateReservationStatusValidator,
} from '#reservation/validators/reservation'
import { middleware } from '#start/kernel'
import { Delete, Get, Group, Middleware, Patch, Post } from '@adonisjs-community/girouette'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
@Group({ prefix: '/reservations', name: 'reservations' })
export default class ReservationsController {
  constructor(private reservationService: ReservationService) {}

  @Post('/', 'store')
  @Middleware(middleware.auth())
  async store({ request, response, auth }: HttpContext) {
    await auth.check()
    const user = auth.user!

    const payload = await request.validateUsing(createReservationValidator)

    const reservation = await this.reservationService.createReservation(user.id, payload)

    return response.created(reservation)
  }

  @Get('/', 'index')
  @Middleware(middleware.auth())
  async index({ request, response }: HttpContext) {
    const payload = await request.validateUsing(indexReservationsValidator)

    const reservations = await this.reservationService.getReservations(payload)

    return response.ok(reservations)
  }

  @Get('/:id', 'show')
  @Middleware(middleware.auth())
  async show({ params, response }: HttpContext) {
    const { id } = params

    const reservation = await this.reservationService.getReservationById(id)

    return response.ok(reservation)
  }

  @Delete('/:id', 'destroy')
  @Middleware(middleware.auth())
  async destroy({ params, response, auth }: HttpContext) {
    await auth.check()
    const user = auth.user!
    const { id } = params

    const reservation = await this.reservationService.cancelReservation(id, user.id)

    return response.ok(reservation)
  }

  @Patch('/update-status/:id', 'updateStatus')
  @Middleware(middleware.auth())
  async updateStatus({ params, request, response }: HttpContext) {
    const { id } = params
    const { status } = await request.validateUsing(updateReservationStatusValidator)

    const reservation = await this.reservationService.updateReservationStatus(id, status)

    return response.ok(reservation)
  }

  @Patch('/cleanup-started', 'cleanupStartedReservations')
  async cleanupStartedReservations({ response }: HttpContext) {
    const cancelledCount =
      await this.reservationService.cancelWaitingInvitationsForStartedReservations()

    return response.ok({
      message: `${cancelledCount} waiting invitation(s) cancelled for started reservations`,
      cancelledCount,
    })
  }
}
