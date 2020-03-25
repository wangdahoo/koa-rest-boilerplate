import Koa from 'koa'
import { logger } from '../logger'

export async function accessLogger (ctx: Koa.Context, next: () => Promise<void>) {
    const start = Date.now()
    await next()
    const ms = Date.now() - start

    let level: string
    if (ctx.status >= 500) {
        level = 'error'
    } else if (ctx.status >= 400) {
        level = 'warn'
    } else if (ctx.status >= 200) {
        level = 'info'
    }

    const msg: string = `${ctx.method} ${ctx.status} ${ctx.originalUrl} ${ms}ms`;
    logger[level](msg)
}
