import { Context } from 'koa'
import { verifyToken } from '../helper/jwt'

interface UserInfoBody {
    uid: number
    isSuper: boolean
}

const excludes: (string | RegExp)[] = ['/', '/ping', /^\/user\/login/]

const inWhiteList = (path: string) => {
    let result = false

    for (const pattern of excludes) {
        if (pattern instanceof RegExp && pattern.test(path)) {
            result = true
            break
        }

        if (typeof pattern === 'string' && pattern === path) {
            result = true
            break
        }
    }

    return result
}

export async function auth (ctx: Context, next: () => Promise<any>) {
    if (inWhiteList(ctx.path)) {
        await next()
        return
    }
    // 检查用户身份
    const userInfo: UserInfoBody = {
        uid: 0,
        isSuper: false
    }

    const token = (ctx.headers.authorization || '').replace(/^Bearer /, '')

    const unauthorized = () => {
        ctx.body = {
            message: '请先登录',
            code: -1
        }
        ctx.status = 401
    }
    if (token) {
        try {
            const { uid, isSuper } = await verifyToken(token)
            userInfo.uid = uid
            userInfo.isSuper = isSuper

            Object.keys(userInfo).forEach(propName => {
                Object.defineProperty(ctx, propName, {
                    get () {
                        return userInfo[propName]
                    }
                })
            })

            await next()
        } catch (e) {
            console.error(e)
            unauthorized()
        }
    } else {
        unauthorized()
    }
}
