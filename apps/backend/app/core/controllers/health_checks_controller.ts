import type { HttpContext } from '@adonisjs/core/http'

import { healthChecks } from '#start/health'
import { Get } from '@adonisjs-community/girouette'

export default class HealthChecksController {
  @Get('/health')
  async handle({ response }: HttpContext) {
    const report = await healthChecks.run()
    if (report.isHealthy) return response.ok(report)

    return response.serviceUnavailable(report)
  }
}
