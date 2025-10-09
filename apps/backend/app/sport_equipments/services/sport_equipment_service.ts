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
  private url =
    'https://equipements.sports.gouv.fr/api/explore/v2.1/catalog/datasets/data-es/records?refine=inst_part_type_filter%3A%22Complexe%20sportif%22'

  async getAllSportEquipments(): Promise<SportEquipmentResponse> {
    const response = await fetch(this.url + '&limit=100')
    if (!response.ok) {
      throw new Error('Failed to fetch sport equipments')
    }
    return response.json() as Promise<SportEquipmentResponse>
  }

  async getSportEquipmentById(equip_numero: string): Promise<SportEquipmentResponse> {
    const response = await fetch(this.url + `&where=equip_numero=${equip_numero}`)
    if (!response.ok) {
      throw new Error('Failed to fetch sport equipment by id')
    }
    return response.json() as Promise<SportEquipmentResponse>
  }

  async getSportsEquipments(
    type_sport: string | null,
    ville: string | null
  ): Promise<SportEquipmentResponse> {
    let whereClauses: string[] = []
    if (type_sport) {
      whereClauses.push(`equip_type_name='${type_sport}'`)
    }
    if (ville) {
      whereClauses.push(`lib_bdv='${ville}'`)
    }
    const whereQuery = whereClauses.length > 0 ? `&where=${whereClauses.join(' AND ')}` : ''
    const response = await fetch(this.url + whereQuery + '&limit=100')
    if (!response.ok) {
      throw new Error('Failed to fetch sport equipments by type and city')
    }
    return response.json() as Promise<SportEquipmentResponse>
  }
}
