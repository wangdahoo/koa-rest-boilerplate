import winston from 'winston'
import Transport from 'winston-transport'
import config from './config'

const transports: Transport[] = [
    new winston.transports.File({ dirname: config.logger.dir, filename: 'error.log', level: 'error' }),
    new winston.transports.File({ dirname: config.logger.dir, filename: 'access.log' })
]

if (process.env.NODE_ENV !== 'development') {
    transports.push(
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    )
}

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports
})
