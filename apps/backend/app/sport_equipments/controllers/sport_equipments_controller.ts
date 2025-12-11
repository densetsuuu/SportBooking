import type { HttpContext } from '@adonisjs/core/http'

import OwnershipRequestDto from '#sport_equipments/dtos/ownership_request_dto'
import SportEquipmentDto from '#sport_equipments/dtos/sport_equipment_dto'
import { SportEquipmentService } from '#sport_equipments/services/sport_equipment_service'
import { assignOwnerValidator, updateOwnerValidator } from '#sport_equipments/validators/owner'
import { indexSportEquipmentsValidator } from '#sport_equipments/validators/sport_equipment'
import { middleware } from '#start/kernel'
import { Delete, Get, Group, Middleware, Patch, Post } from '@adonisjs-community/girouette'
import { inject } from '@adonisjs/core'

@inject()
@Group({ prefix: '/sport_equipments', name: 'sport_equipments' })
export default class SportEquipmentsController {
  constructor(private sportEquipmentService: SportEquipmentService) {}

  @Get('/', 'index')
  public async index({ request, response }: HttpContext) {
    const payload = await request.validateUsing(indexSportEquipmentsValidator)

    const data = await this.sportEquipmentService.getSportsEquipments(payload)

    return response.ok({
      data: SportEquipmentDto.fromArray(data.results),
      total: data.total_count,
      page: payload.page,
      limit: payload.limit,
    })
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

  @Get('/:equip_numero/owner', 'owner.show')
  public async showOwner({ params, response }: HttpContext) {
    const { equip_numero: equipNumero } = params

    const owner = await this.sportEquipmentService.getOwner(equipNumero)

    if (!owner) {
      return response.notFound({ message: 'No owner found for this sport equipment' })
    }

    return response.ok(owner)
  }

  @Post('/:equip_numero/owner', 'owner.store')
  @Middleware(middleware.auth())
  public async assignOwner({ params, request, response }: HttpContext) {
    const { equip_numero: equipNumero } = params
    const { userId, file, phoneNumber } = await request.validateUsing(assignOwnerValidator)

    const ownership = await this.sportEquipmentService.assignOwner(
      equipNumero,
      userId,
      file,
      phoneNumber
    )

    return response.created(ownership)
  }

  @Delete('/:equip_numero/owner', 'owner.destroy')
  @Middleware(middleware.auth())
  public async removeOwner({ params, response, auth }: HttpContext) {
    const { equip_numero: equipNumero } = params
    const user = auth.getUserOrFail()

    await this.sportEquipmentService.removeOwner(equipNumero, user.id)

    return response.noContent()
  }

  @Patch('/:equip_numero/owner', 'owner.update')
  @Middleware(middleware.auth())
  public async updateOwner({ params, request, response, auth }: HttpContext) {
    const { equip_numero: equipNumero } = params
    const { userId } = await request.validateUsing(updateOwnerValidator)
    const user = auth.getUserOrFail()

    const ownership = await this.sportEquipmentService.updateOwner(equipNumero, userId, user.id)

    return response.ok(ownership)
  }

  @Patch('/ownership/:ownershipId/approve', 'owner.approve')
  @Middleware([middleware.auth(), middleware.admin()])
  public async approveOwnership({ params, response }: HttpContext) {
    const { ownershipId } = params

    const ownership = await this.sportEquipmentService.approveOwnership(ownershipId)

    return response.ok(ownership)
  }

  @Patch('/ownership/:ownershipId/refuse', 'owner.refuse')
  @Middleware([middleware.auth(), middleware.admin()])
  public async refuseOwnership({ params, response }: HttpContext) {
    const { ownershipId } = params

    const ownership = await this.sportEquipmentService.refuseOwnership(ownershipId)

    return response.ok(ownership)
  }

  @Get('/ownership/pending', 'owner.pending')
  @Middleware([middleware.auth(), middleware.admin()])
  public async getPendingOwnershipRequests({ response }: HttpContext) {
    const { requests, namesMap } = await this.sportEquipmentService.getPendingOwnershipRequests()

    return response.ok(OwnershipRequestDto.fromArrayWithNames(requests, namesMap))
  }
}
