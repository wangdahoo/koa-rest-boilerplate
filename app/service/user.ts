import { getManager } from 'typeorm'
import { User } from '../entity/User'
import { ApiException } from '../exception'
import { createToken } from '../helper/jwt'
import md5 from 'md5'

export class UserService {
    async createDefaultSuperUser (): Promise<void> {
        const superUsername = process.env.SUPER_USERNAME
        const superPassword = process.env.SUPER_PASSWORD

        if (superUsername && superPassword) {
            const exists = await User.count({
                username: superUsername,
                isSuper: true
            })

            if (exists === 0) {
                const user = new User()
                user.username = superUsername
                user.password = md5(superPassword)
                user.isSuper = true
                await user.save()
            }
        }
    }

    async login (username: string, password: string): Promise<string> {
        const user = await getManager().findOne(User, {
            where: {
                username,
                password: md5(password)
            }
        })

        if (user) {
            if (!user.isActive) {
                throw new ApiException('您的账户已经被锁定，请联系管理员')
            }

            // make token
            const token = createToken({
                uid: user.id,
                isSuper: user.isSuper
            })

            console.info(`用户登录成功 id: ${user.id}, username: ${username}, isSuper: ${user.isSuper}`)

            return token
        } else {
            throw new ApiException('用户名或密码错误')
        }
    }
}
