import Koa, { Context } from 'koa'
import Router from 'koa-router'
import { Validator, ValidatorResult } from 'jsonschema'
import { ApiException } from '../exception'

export enum ApiMethod {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    PATCH = 'patch',
    DELETE = 'delete'
}

interface DecoratorRouteConfig {
    method: string
    path: string
    handler: (ctx: Context) => Promise<void>
    middleware?: (ctx: Context, next: () => Promise<void>) => Promise<void>
}

class DecoratorRouter extends Router {
    private routeConfigs: Map<string, DecoratorRouteConfig> = new Map<string, DecoratorRouteConfig>()

    addRouteConfig (routeConfig: DecoratorRouteConfig) {
        const { method, path } = routeConfig
        const key = `${method}-${path}`

        if (!this.routeConfigs.has(key)) {
            this.routeConfigs.set(key, routeConfig)
        }
    }

    setup (): Router {
        for (const routeConfig of this.routeConfigs.values()) {
            const { method, path, handler, middleware } = routeConfig
            const args = middleware ? [path, middleware, handler] : [path, handler]
            router[method](...args)
        }

        return this
    }
}

const router = new DecoratorRouter()

export function api (
    method: ApiMethod,
    path: string,
    middleware?: (ctx: Context, next: () => Promise<void>) => Promise<void>
) {
    return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
        const callee = target[methodName] as (ctx: Context) => Promise<void>

        router.addRouteConfig({
            method,
            path,
            handler: callee,
            middleware
        })
    }
}

export function body (body: any) {
    return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
        const callee = target[methodName] as (ctx: Context) => Promise<void>
        const validate = (ctx: Context): ValidatorResult => {
            const schema = {
                type: 'object',
                properties: body
            }
            return new Validator().validate(ctx.request.body, schema)
        }

        target[methodName] = async function (ctx: Context) {
            const { valid, errors } = validate(ctx)

            if (valid) {
                await callee(ctx)
            } else {
                // TODO: 更合理的方式是返回全部的 errors
                const err = errors[0]
                const errmsg = `${err.property.replace('instance.', '')} ${err.message}`
                ctx.error(new ApiException(errmsg, 400))
            }
        }
    }
}

export const setupRouter = (app: Koa) => {
    const r = router.setup()
    app.use(r.routes()).use(r.allowedMethods())
}
