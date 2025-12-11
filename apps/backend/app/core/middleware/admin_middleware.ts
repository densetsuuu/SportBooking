import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Admin middleware is used to restrict access to admin users only.
 * Must be used after auth middleware.
 */
export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.getUserOrFail()

    if (user.type !== 'admin') {
      return ctx.response.forbidden({ message: 'Access denied. Admin privileges required.' })
    }

    return next()
  }
}
