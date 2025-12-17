import FileService from '#common/services/file_service'
import OwnerSportEquipment from '#sport_equipments/models/owner_sport_equipment'
import { indexSportEquipmentsValidator } from '#sport_equipments/validators/sport_equipment'
import User from '#users/models/user'
import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'
import { Infer } from '@vinejs/vine/types'
import { GovEquipments } from '#core/clients/gov_equipments'

@inject()
export class SportEquipmentService {
  constructor(
    private fileService: FileService,
    private equipmentsClient: GovEquipments
  ) {}

  async getSportEquipmentById(equipmentId: string) {
    const data = await this.equipmentsClient.getEquipmentOrFail(equipmentId)
    const owner = await OwnerSportEquipment.query()
      .where('sportEquipmentId', equipmentId)
      .where('status', 'approved')
      .first()

    if (owner) {
      data.owner = {
        status: owner.status,
        phoneNumber: owner.phoneNumber,
      }
    }

    return data
  }

  async getSportsEquipments({
    typeSport,
    ville,
    page,
    limit = 20,
    nom,
  }: Infer<typeof indexSportEquipmentsValidator>) {
    let offset = page && limit ? (page - 1) * limit : 0

    const data = await this.equipmentsClient.getEquipments({
      limit,
      offset,
      type: typeSport,
      location: ville,
      name: nom,
    })

    const equipIds = data.results.map((r) => r.equip_numero)
    const owners = await OwnerSportEquipment.query()
      .whereIn('sportEquipmentId', equipIds)
      .where('status', 'approved')

    data.results.forEach((equipment) => {
      const owner = owners.find((o) => o.sportEquipmentId === equipment.equip_numero)
      if (owner) {
        equipment.owner = {
          status: owner.status,
          phoneNumber: owner.phoneNumber,
        }
      }
    })

    return {
      total_count: data.total_count,
      results: data.results,
    }
  }

  /**
   * Assign an owner to a sport equipment
   * Multiple requests can be made for the same equipment while no request is approved.
   * Once a request is approved, no more requests can be made.
   */
  async assignOwner(
    sportEquipmentId: string,
    userId: string,
    file: any,
    phoneNumber: string
  ): Promise<OwnerSportEquipment> {
    // Verify user exists
    const user = await User.find(userId)
    if (!user) {
      throw new Exception('User not found', { status: 404 })
    }

    // Verify sport equipment exists in the external API
    const sportEquipment = await this.getSportEquipmentById(sportEquipmentId)
    if (!sportEquipment) {
      throw new Exception('Sport equipment not found', { status: 404 })
    }

    // Check if an approved ownership already exists - block new requests
    const approvedOwnership = await OwnerSportEquipment.query()
      .where('sportEquipmentId', sportEquipmentId)
      .where('status', 'approved')
      .first()

    if (approvedOwnership) {
      throw new Exception('This sport equipment already has an approved owner', { status: 409 })
    }

    // Create ownership request (multiple waiting requests are allowed)
    const ownership = new OwnerSportEquipment()
    ownership.ownerId = userId
    ownership.sportEquipmentId = sportEquipmentId
    ownership.status = 'waiting'
    ownership.phoneNumber = phoneNumber

    if (file) {
      ownership.fileIdentification = await this.fileService.uploadFile(file)
    }

    await ownership.save()

    await ownership.load('owner')
    return ownership
  }

  /**
   * Approve an ownership request
   * When a request is approved, all other pending requests for the same equipment are refused.
   */
  async approveOwnership(ownershipId: string): Promise<OwnerSportEquipment> {
    const ownership = await OwnerSportEquipment.find(ownershipId)

    if (!ownership) {
      throw new Exception('Ownership request not found', { status: 404 })
    }

    if (ownership.status !== 'waiting') {
      throw new Exception('Only waiting requests can be approved', { status: 400 })
    }

    // Check if another ownership is already approved for this equipment
    const existingApproved = await OwnerSportEquipment.query()
      .where('sportEquipmentId', ownership.sportEquipmentId)
      .where('status', 'approved')
      .first()

    if (existingApproved) {
      throw new Exception('This sport equipment already has an approved owner', { status: 409 })
    }

    // Approve this request
    ownership.status = 'approved'
    await ownership.save()

    // Refuse all other pending requests for the same equipment
    await OwnerSportEquipment.query()
      .where('sportEquipmentId', ownership.sportEquipmentId)
      .where('status', 'waiting')
      .whereNot('id', ownershipId)
      .update({ status: 'refused' })

    await ownership.load('owner')
    return ownership
  }

  /**
   * Refuse an ownership request
   */
  async refuseOwnership(ownershipId: string): Promise<OwnerSportEquipment> {
    const ownership = await OwnerSportEquipment.find(ownershipId)

    if (!ownership) {
      throw new Exception('Ownership request not found', { status: 404 })
    }

    if (ownership.status !== 'waiting') {
      throw new Exception('Only waiting requests can be refused', { status: 400 })
    }

    ownership.status = 'refused'
    await ownership.save()

    await ownership.load('owner')
    return ownership
  }

  /**
   * Remove owner from a sport equipment
   */
  async removeOwner(sportEquipmentId: string, currentUserId: string): Promise<void> {
    const ownership = await OwnerSportEquipment.query()
      .where('sportEquipmentId', sportEquipmentId)
      .first()

    if (!ownership) {
      throw new Exception('No owner found for this sport equipment', { status: 404 })
    }

    // Verify that the current user is the owner
    if (ownership.ownerId !== currentUserId) {
      throw new Exception('You are not authorized to remove this ownership', { status: 403 })
    }

    await ownership.delete()
  }

  /**
   * Update the owner of a sport equipment
   */
  async updateOwner(
    sportEquipmentId: string,
    newUserId: string,
    currentUserId: string
  ): Promise<OwnerSportEquipment> {
    // Verify new user exists
    const user = await User.find(newUserId)
    if (!user) {
      throw new Exception('User not found', { status: 404 })
    }

    const ownership = await OwnerSportEquipment.query()
      .where('sportEquipmentId', sportEquipmentId)
      .first()

    if (!ownership) {
      throw new Exception('No owner found for this sport equipment', { status: 404 })
    }

    // Verify that the current user is the owner
    if (ownership.ownerId !== currentUserId) {
      throw new Exception('You are not authorized to update this ownership', { status: 403 })
    }

    // Update owner
    ownership.ownerId = newUserId
    await ownership.save()
    await ownership.load('owner')

    return ownership
  }

  async getOwner(sportEquipmentId: string): Promise<OwnerSportEquipment | null> {
    return await OwnerSportEquipment.query()
      .where('sportEquipmentId', sportEquipmentId)
      .preload('owner')
      .first()
  }
}
