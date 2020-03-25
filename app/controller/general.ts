import { BaseContext } from 'koa'
import { tagsAll, request, summary } from 'koa-swagger-decorator'

@tagsAll(['General'])
export default class GeneralController {
    @request('get', '/')
    public static async index (ctx: BaseContext) {
        ctx.body = 'OK'
    }

    @request('get', '/ping')
    @summary('A Ping-Pong echo.')
    public static async ping (ctx: BaseContext) {
        ctx.body = 'Pong!'
    }
}
