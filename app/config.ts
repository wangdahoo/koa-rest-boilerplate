import dotenv from 'dotenv'
import { ConnectionOptions } from 'typeorm'
import { resolve } from 'path'
import fs from 'fs'

dotenv.config({ path: './config/.default.env' })

const overrideConfigFile = `${process.cwd()}/config/.${process.env.NODE_ENV || 'development'}.env`
const overrideConfig = dotenv.parse(fs.readFileSync(overrideConfigFile))

for (const k in overrideConfig) {
    process.env[k] = overrideConfig[k]
}

const isDev = process.env.NODE_ENV === 'development'

export interface Web {
    port: number
}

export interface Jwt {
    secret: string
    expiresIn: number
}

export interface RedisConfig {
    host: string
    port: number
    password: string
    database: number
}

export interface Logger {
    level: string
    dir: string
}

export interface IConfig {
    web: Web
    jwt: Jwt
    typeorm: ConnectionOptions
    redis: RedisConfig
    logger: Logger
}

const web: Web = {
    port: ~~process.env.PORT
}

const jwt: Jwt = {
    secret: process.env.JWT_SECRET,
    expiresIn: Number(process.env.JWT_EXPIRES_IN)
}

const typeorm: ConnectionOptions = {
    type: 'mysql',
    host: process.env.TYPEORM_HOST,
    port: +process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    synchronize: isDev,
    logging: isDev,
    entities: ['app/entity/**/*.ts'],
    migrations: ['app/migration/*.ts'],
    subscribers: ['app/subscriber/**/*.ts']
}

const redis: RedisConfig = {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    database: +process.env.REDIS_DATABASE
}

const logger: Logger = {
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    dir: process.env.LOGGER_DIR || resolve(__dirname, '../logs/')
}

const config: IConfig = {
    web,
    jwt,
    typeorm,
    redis,
    logger
}

export default config
