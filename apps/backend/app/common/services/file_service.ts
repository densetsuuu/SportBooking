import { inject } from '@adonisjs/core'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import drive from '@adonisjs/drive/services/main'
import { attachmentManager } from '@jrmc/adonis-attachment'

@inject()
export default class FileService {
  async uploadFile(file?: MultipartFile | null) {
    if (!file) {
      return null
    }
    return await attachmentManager.createFromFile(file)
  }

  async fromUrl(url?: string | null) {
    if (!url) {
      return null
    }
    return await attachmentManager.createFromUrl(new URL(url))
  }

  async getSignedUrl(filePath: string, expiresIn: string = '1h'): Promise<string> {
    return drive.use().getSignedUrl(filePath, { expiresIn })
  }

  async deleteFile(filePath: string): Promise<void> {
    await drive.use().delete(filePath)
  }

  async fileExists(filePath: string): Promise<boolean> {
    return drive.use().exists(filePath)
  }
}
