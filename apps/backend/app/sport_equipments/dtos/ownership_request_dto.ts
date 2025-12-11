import AttachmentDto from '#common/dtos/attachment_dto'
import OwnerSportEquipment from '#sport_equipments/models/owner_sport_equipment'
import { BaseModelDto } from '@adocasts.com/dto/base'

export default class OwnershipRequestDto extends BaseModelDto {
  declare id: string
  declare sportEquipmentId: string
  declare sportEquipmentName: string | null
  declare status: 'approved' | 'refused' | 'waiting'
  declare phoneNumber: string | null
  declare fileIdentification: AttachmentDto | null
  declare createdAt: string
  declare owner: {
    id: string
    fullName: string
    email: string
  } | null

  constructor(ownership?: OwnerSportEquipment, sportEquipmentName?: string | null) {
    super()

    if (!ownership) return
    this.id = ownership.id
    this.sportEquipmentId = ownership.sportEquipmentId
    this.sportEquipmentName = sportEquipmentName || null
    this.status = ownership.status
    this.phoneNumber = ownership.phoneNumber
    this.fileIdentification = ownership.fileIdentification
      ? new AttachmentDto(ownership.fileIdentification)
      : null
    this.createdAt = ownership.createdAt.toISO()!
    this.owner = ownership.owner
      ? {
          id: ownership.owner.id,
          fullName: ownership.owner.fullName,
          email: ownership.owner.email,
        }
      : null
  }

  static fromArrayWithNames(
    ownerships: OwnerSportEquipment[],
    namesMap: Map<string, string>
  ): OwnershipRequestDto[] {
    return ownerships.map(
      (ownership) => new OwnershipRequestDto(ownership, namesMap.get(ownership.sportEquipmentId))
    )
  }
}
