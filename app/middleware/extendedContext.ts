import { Context } from 'koa'
import { service } from '../service'
import { ApiException } from '../exception'

export async function extendedContext (ctx: Context, next: () => Promise<any>) {
    Object.defineProperties(ctx, {
        service: {
            get () {
                return service
            }
        },

        success: {
            get () {
                return function (body: any, status?: number) {
                    ctx.body = body
                    ctx.status = status || 200
                }
            }
        },

        error: {
            get () {
                return function (err: Error) {
                    if (err instanceof ApiException) {
                        ctx.status = (err as ApiException).status
                        ctx.body = {
                            message: err.message,
                            code: err.code
                        }
                    } else {
                        throw err
                    }
                }
            }
        }
    })

    await next()
}
