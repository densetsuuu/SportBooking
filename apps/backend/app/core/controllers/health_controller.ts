import { Get, Group } from '@adonisjs-community/girouette'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

@Group({ name: 'health', prefix: '/health' })
export default class HealthController {
  @Get('/', 'check')
  async check({ response }: HttpContext) {
    try {
      await db.connection().raw('SELECT 1')
      return response.ok({ status: 'ok', database: 'connected' })
    } catch (error) {
      return response.serviceUnavailable({ status: 'error', database: 'disconnected' })
    }
  }
}
