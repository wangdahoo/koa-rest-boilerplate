import { promisify } from 'util'
import redis from 'redis'
import config, { RedisConfig } from '../config'

const REDIS_CLIENT_METHODS = Object.getOwnPropertyNames(
    redis.RedisClient.prototype
).filter(name => /^[a-z]+$/.test(name))

function promisifyRedisClient (
    client: redis.RedisClient,
    methods: string[] = REDIS_CLIENT_METHODS
): PromisifiedRedisClient {
    return methods.reduce((client, name) => {
        client[`${name}Async`] = promisify(client[name]).bind(client)
        return client
    }, client) as PromisifiedRedisClient
}

function getClientOptions (redisConfig: RedisConfig): redis.ClientOpts {
    const { host, port, password } = redisConfig

    return {
        host,
        port,
        ...(password ? { password } : {})
    }
}

interface PromisifiedRedisClient extends redis.RedisClient {
    /**
     * Ping the server.
     */
    pingAsync(): Promise<string>
    pingAsync(message: string): Promise<string>

    // TODO: should define all redis methods
}

export function getRedisClient (
    db: number = config.redis.database
): Promise<PromisifiedRedisClient> {
    return new Promise((resolve, reject) => {
        const client = redis.createClient(getClientOptions(config.redis))

        client.on('connect', () => {
            if (db > 0) client.select(db)
            const promisifidClient = promisifyRedisClient(
                client
            ) as PromisifiedRedisClient
            resolve(promisifidClient)
        })

        client.on('error', err => {
            console.error('Redis Client Error:', err)
            reject(err)
        })
    })
}
