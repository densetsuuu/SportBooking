import { BaseModelDto } from '@adocasts.com/dto/base'

export type SportEquipment = {
  equip_numero: string
  equip_nom: string
  equip_coordonnees: { lon: number; lat: number }
  equip_type_name: string
  inst_cp: string
  inst_adresse: string
  lib_bdv: string
  image?: string
  description?: string
  capacite?: number
}

export default class SportEquipmentDto extends BaseModelDto {
  id?: string
  nom?: string
  coordonnees?: { lon: number; lat: number }
  type?: string
  postalCode?: string
  address?: string
  libBdv?: string
  image?: string
  description?: string
  capacite?: number

  constructor(input: SportEquipment) {
    super()
    if (!input) return

    this.id = input.equip_numero
    this.nom = input.equip_nom
    this.coordonnees = input.equip_coordonnees
    this.type = input.equip_type_name
    this.postalCode = input.inst_cp
    this.address = input.inst_adresse
    this.libBdv = input.lib_bdv
    this.image = input.image
    this.description = input.description
    this.capacite = input.capacite
  }
}
