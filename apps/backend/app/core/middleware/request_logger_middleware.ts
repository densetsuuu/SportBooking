import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RequestLoggerMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    await next()

    const { request, response, logger, route } = ctx

    let url = route?.pattern || request.url()

    if (route?.pattern) {
      url = url.replace(/:([a-zA-Z0-9_]+)/g, '{$1}')
    }

    logger.info(
      {
        method: request.method(),
        url,
        status: response.getStatus(),
      },
      'request completed'
    )
  }
}
