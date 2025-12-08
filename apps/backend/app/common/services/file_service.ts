import { MultipartFile } from '@adonisjs/core/bodyparser'
import { attachmentManager } from '@jrmc/adonis-attachment'

export default class FileService {
  async uploadFile(file: MultipartFile) {
    return attachmentManager.createFromFile(file)
  }
}
