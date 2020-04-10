import { Context } from 'koa'
import { api, ApiMethod } from '../router'

export default class GeneralController {
    @api(ApiMethod.GET, '/')
    public static async index (ctx: Context) {
        ctx.body = 'OK'
    }

    @api(ApiMethod.GET, '/ping')
    public static async ping (ctx: Context) {
        ctx.body = 'Pong!'
    }
}
