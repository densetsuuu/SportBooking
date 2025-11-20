import { indexSportEquipmentsValidator } from '#sport_equipments/validators/sport_equipment'
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
}

type SportEquipmentResponse = {
  total_count: number
  results: SportEquipment[]
}

export class SportEquipmentService {
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
    return this.mapToSportEquipment(data.results[0])
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
    return {
      total_count: data.total_count,
      results: data.results.map((item) => this.mapToSportEquipment(item)),
    }
  }
}
