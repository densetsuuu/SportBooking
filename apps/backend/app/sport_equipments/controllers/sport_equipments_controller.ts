import type { HttpContext } from '@adonisjs/core/http'

import { inject } from '@adonisjs/core'
import { SportEquipmentService } from '#sport_equipments/services/sport_equipment_service'

@inject()
export default class SportEquipmentsController {
  constructor(private sportEquipmentService: SportEquipmentService) {}

  /**
   * Get all sport equipments with optional filters
   * Query params: type_sport, ville
   */
  public async index({ request, response }: HttpContext) {
    try {
      const typeSport = request.qs().type_sport || null
      const ville = request.qs().ville || null

      const data = await this.sportEquipmentService.getSportsEquipments(typeSport, ville)

      return response.ok(data)
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch sport equipments',
        error: error.message,
      })
    }
  }

  /**
   * Get a specific sport equipment by equip_numero
   */
  public async show({ params, response }: HttpContext) {
    try {
      const { equip_numero: equipNumero } = params

      const data = await this.sportEquipmentService.getSportEquipmentById(equipNumero)

      if (data.total_count === 0) {
        return response.notFound({
          message: 'Sport equipment not found',
        })
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
