import FileService from '#common/services/file_service'
import OwnerSportEquipment from '#sport_equipments/models/owner_sport_equipment'
import { indexSportEquipmentsValidator } from '#sport_equipments/validators/sport_equipment'
import User from '#users/models/user'
import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'
import { Infer } from '@vinejs/vine/types'

type SportEquipment = {
  equip_numero: string
  inst_numero: string
  inst_nom: string
  inst_adresse: string
  inst_cp: string
  equip_nom: string
  equip_type_name: string
  equip_coordonnees: {
    lon: number
    lat: number
  }
  lib_bdv: string
  owner?: {
    status: 'approved' | 'refused' | 'waiting'
    phoneNumber: string | null
  } | null
}

type SportEquipmentResponse = {
  total_count: number
  results: SportEquipment[]
}

@inject()
export class SportEquipmentService {
  constructor(private fileService: FileService) {}

  /**
   * Maps raw API data to SportEquipment type
   */
  private mapToSportEquipment(data: any): SportEquipment {
    return {
      equip_numero: data.equip_numero,
      inst_numero: data.inst_numero,
      inst_nom: data.inst_nom,
      inst_adresse: data.inst_adresse,
      inst_cp: data.inst_cp,
      equip_nom: data.equip_nom,
      equip_type_name: data.equip_type_name,
      equip_coordonnees: data.equip_coordonnees,
      lib_bdv: data.lib_bdv,
    }
  }

  private url =
    'https://equipements.sports.gouv.fr/api/explore/v2.1/catalog/datasets/data-es/records?refine=inst_part_type_filter%3A%22Complexe%20sportif%22'

  async getSportEquipmentById(equip_numero: string): Promise<SportEquipment> {
    const response = await fetch(this.url + `&where=equip_numero="${equip_numero}"`)
    if (!response.ok) {
      throw new Exception('Failed to fetch sport equipment by id', { status: 500 })
    }
    const data = (await response.json()) as SportEquipmentResponse
    const equipment = this.mapToSportEquipment(data.results[0])

    const owner = await OwnerSportEquipment.query()
      .where('sportEquipmentId', equip_numero)
      .where('status', 'approved')
      .first()

    if (owner) {
      equipment.owner = {
        status: owner.status,
        phoneNumber: owner.phoneNumber,
      }
    }

    return equipment
  }

  async getSportsEquipments({
    typeSport,
    ville,
    page,
    limit = 20,
    nom,
  }: Infer<typeof indexSportEquipmentsValidator>): Promise<SportEquipmentResponse> {
    let whereClauses: string[] = []
    let offset = page && limit ? (page - 1) * limit : 0

    if (typeSport) {
      whereClauses.push(`equip_type_name LIKE '%${typeSport}%'`)
    }
    if (ville) {
      whereClauses.push(`lib_bdv LIKE '%${ville}%'`)
    }
    if (nom) {
      whereClauses.push(`equip_nom LIKE '%${nom}%'`)
    }
    const whereQuery = whereClauses.length > 0 ? `&where=${whereClauses.join(' AND ')}` : ''
    const response = await fetch(this.url + whereQuery + `&limit=${limit}&offset=${offset}`)
    if (!response.ok) {
      throw new Error('Failed to fetch sport equipments by type and city')
    }
    const data = (await response.json()) as SportEquipmentResponse

    const results = data.results.map((item) => this.mapToSportEquipment(item))

    const equipIds = results.map((r) => r.equip_numero)
    const owners = await OwnerSportEquipment.query()
      .whereIn('sportEquipmentId', equipIds)
      .where('status', 'approved')

    results.forEach((equipment) => {
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
      results,
    }
  }

  /**
   * Assign an owner to a sport equipment
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

    // Check if ownership already exists
    const existingOwnership = await OwnerSportEquipment.query()
      .where('sportEquipmentId', sportEquipmentId)
      .first()

    if (existingOwnership) {
      throw new Exception('This sport equipment already has an owner', { status: 409 })
    }

    // Create ownership
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

  /**
   * Get owner of a sport equipment
   */
  async getOwner(sportEquipmentId: string): Promise<OwnerSportEquipment | null> {
    const ownership = await OwnerSportEquipment.query()
      .where('sportEquipmentId', sportEquipmentId)
      .preload('owner')
      .first()

    return ownership
  }
}
