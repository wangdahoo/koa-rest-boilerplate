import { Context } from 'koa'
import validate from 'koa-swagger-decorator/dist/validate'
import { ApiException } from '../exception'

export const validator = (schema: any) => async (ctx: Context, next: () => Promise<void>) => {
    try {
        const { querySchema, bodySchema } = schema
        if (querySchema) {
            validate(ctx.query, querySchema)
        }
        if (bodySchema) {
            validate(ctx.request.body, bodySchema)
        }
        validate(ctx.request.body, schema)
        await next()
    } catch (e) {
        ctx.fail(new ApiException(e.message || e.toString(), 400))
    }
}
