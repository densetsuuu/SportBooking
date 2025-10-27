import type { HttpContext } from '@adonisjs/core/http'

import { SportEquipmentService } from '#sport_equipments/services/sport_equipment_service'
import { indexSportEquipmentsValidator } from '#sport_equipments/validators/sport_equipment'
import { inject } from '@adonisjs/core'

@inject()
export default class SportEquipmentsController {
  constructor(private sportEquipmentService: SportEquipmentService) {}

  /**
   * Get all sport equipments with optional filters
   * Query params: type_sport, ville
   */
  public async index({ request, response }: HttpContext) {
    const payload = await request.validateUsing(indexSportEquipmentsValidator)

    const data = await this.sportEquipmentService.getSportsEquipments(payload)

    return response.ok(data)
  }

  /**
   * Get a specific sport equipment by equip_numero
   */
  public async show({ params, response }: HttpContext) {
    try {
      const { equip_numero: equipNumero } = params

      const data = await this.sportEquipmentService.getSportEquipmentById(equipNumero)

      if (data === undefined) {
        return response.notFound({ message: 'Sport equipment not found' })
      }

      return response.ok(data)
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch sport equipment',
        error: error.message,
      })
    }
  }
}
