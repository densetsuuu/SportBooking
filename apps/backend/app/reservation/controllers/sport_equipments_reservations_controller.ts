import { ReservationService } from '#reservation/services/reservation_service'
import { Get } from '@adonisjs-community/girouette'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class SportEquipmentsReservationsController {
  constructor(private reservationService: ReservationService) {}

  @Get('/sport_equipments/:equip_numero/reservations', 'getByEquipment')
  async getByEquipment({ params, response }: HttpContext) {
    const { equip_numero: equipNumero } = params

    const reservations = await this.reservationService.getReservations({
      sportEquipmentId: equipNumero,
    })

    return response.ok(reservations)
  }
}
