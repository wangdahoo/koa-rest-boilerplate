import { sign, verify } from 'jsonwebtoken'
import config from '../config'

const { secret, expiresIn } = config.jwt

export function createToken (payload: any): string {
    const token = sign(payload, secret, {
        expiresIn
    })
    return token
}

export async function verifyToken (token: string): Promise<any> {
    return new Promise((resolve, reject) => {
        verify(token, secret, (err, decoded) => {
            if (err) return reject(err)
            resolve(decoded)
        })
    })
}
