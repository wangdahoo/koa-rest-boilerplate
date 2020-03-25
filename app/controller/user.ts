import { Context } from 'koa'
import { tagsAll, request, summary, body, middlewares } from 'koa-swagger-decorator'
import { validator } from '../middleware'
import { userLoginSchema } from '../entity/User'

@tagsAll(['User'])
export default class UserController {
    @request('post', '/user/login')
    @summary('用户登录接口')
    @body(userLoginSchema)
    @middlewares([validator(userLoginSchema)])
    public static async loginByPwd (ctx: Context) {
        const { username, password } = ctx.request.body
        try {
            const token = await ctx.service.user.login(username, password)
            ctx.success({ token })
        } catch (e) {
            ctx.fail(e)
        }
    }
}
