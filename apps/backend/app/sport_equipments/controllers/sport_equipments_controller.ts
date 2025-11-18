import type { HttpContext } from '@adonisjs/core/http'

import { SportEquipmentService } from '#sport_equipments/services/sport_equipment_service'
import { indexSportEquipmentsValidator } from '#sport_equipments/validators/sport_equipment'
import { Get, Group } from '@adonisjs-community/girouette'
import { inject } from '@adonisjs/core'

@inject()
@Group({ prefix: '/sport_equipments', name: 'sport_equipments' })
export default class SportEquipmentsController {
  constructor(private sportEquipmentService: SportEquipmentService) {}

  @Get('/', 'index')
  public async index({ request, response }: HttpContext) {
    const payload = await request.validateUsing(indexSportEquipmentsValidator)

    const data = await this.sportEquipmentService.getSportsEquipments(payload)

    return response.ok(data)
  }

  @Get('/:equip_numero', 'show')
  public async show({ params, response }: HttpContext) {
    const { equip_numero: equipNumero } = params

    const data = await this.sportEquipmentService.getSportEquipmentById(equipNumero)

    if (data === undefined) {
      return response.notFound({ message: 'Sport equipment not found' })
    }

    return response.ok(data)
  }
}
