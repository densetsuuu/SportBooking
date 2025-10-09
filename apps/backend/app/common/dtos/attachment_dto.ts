import { BaseModelDto } from '@adocasts.com/dto/base'
import { Attachment } from '@jrmc/adonis-attachment/types/attachment'

export default class AttachmentDto extends BaseModelDto {
  declare name: string
  declare url?: string
  declare size: number
  declare type: string

  constructor(attachment: Attachment | null) {
    super()

    if (!attachment) return
    this.name = attachment.originalName
    this.url = attachment.url
    this.size = attachment.size
    this.type = attachment.mimeType
  }

  toBroadcastable() {
    if (!this.url) return null

    return {
      name: this.name,
      url: this.url,
      size: this.size,
      type: this.type,
    }
  }
}
