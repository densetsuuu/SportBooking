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
  hasApprovedOwner?: boolean
}

export default class SportEquipmentDto extends BaseModelDto {
  declare id: string
  declare nom: string
  declare coordonnees?: { lon: number; lat: number }
  declare type?: string
  declare postalCode?: string
  declare address?: string
  declare libBdv?: string
  declare image?: string
  declare description?: string
  declare capacite?: number
  declare hasApprovedOwner?: boolean

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
    this.hasApprovedOwner = input.hasApprovedOwner
  }
}
