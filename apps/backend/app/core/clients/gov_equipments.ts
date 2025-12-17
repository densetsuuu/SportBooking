import type { KyInstance } from 'ky'
import ky from 'ky'
import { SportEquipment } from '#sport_equipments/dtos/sport_equipment_dto'
import { Exception } from '@adonisjs/core/exceptions'

type SportEquipmentsRequest = {
  limit: number
  offset: number
  type?: string
  location?: string
  name?: string
}

type SportEquipmentResponse = {
  total_count: number
  results: SportEquipment[]
}

export class GovEquipments {
  #ky: KyInstance

  constructor() {
    this.#ky = ky.create({
      prefixUrl:
        'https://equipements.sports.gouv.fr/api/explore/v2.1/catalog/datasets/data-es/records?refine=inst_part_type_filter%3A%22Complexe%20sportif%22',
    })
  }

  async getEquipmentOrFail(equipment_id: string) {
    const results = (await this.#ky
      .get('', {
        searchParams: {
          where: `equip_numero="${equipment_id}"`,
          limit: 1,
        },
      })
      .json()) as SportEquipmentResponse

    if (results.total_count === 0) {
      throw new Exception('Equipment not found', { status: 404 })
    }

    return results.results.at(0) as SportEquipment
  }

  async getEquipments(data: SportEquipmentsRequest) {
    const filters = [
      data.type ? `equip_type_name="${data.type}"` : null,
      data.location ? `inst_cp="${data.location}"` : null,
      data.name ? `equip_nom LIKE "%${data.name}%"` : null,
    ]

    return (await this.#ky
      .get('', {
        searchParams: {
          limit: data.limit,
          offset: data.offset,
          where: filters.filter(Boolean).join(' AND '),
        },
      })
      .json()) as SportEquipmentResponse
  }
}
