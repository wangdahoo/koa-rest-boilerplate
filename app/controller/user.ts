import { Context } from 'koa'
import { api, ApiMethod, body } from '../router'
import { userLoginBody } from '../entity/User'

export default class UserController {
    @api(ApiMethod.POST, '/user/login')
    @body(userLoginBody)
    public static async loginByPwd (ctx: Context) {
        const { username, password } = ctx.request.body
        try {
            const token = await ctx.service.user.login(username, password)
            ctx.success({ token })
        } catch (e) {
            ctx.error(e)
        }
    }
}
