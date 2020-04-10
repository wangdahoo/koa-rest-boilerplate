const dotenv = require('dotenv')
const fs = require('fs')

// load default config
dotenv.config({ path: `${process.cwd()}/config/.default.env` })

// override config
const overrideConfigFile = `${process.cwd()}/config/.${process.env.NODE_ENV || 'development'}.env`
const overrideConfig = dotenv.parse(fs.readFileSync(overrideConfigFile))
for (const k in overrideConfig) {
    process.env[k] = overrideConfig[k]
}

const commonConfig = {
    type: 'mysql',
    entities: ['app/entity/**/*.ts'],
    migrations: ['app/migration/**/*.ts'],
    cli: {
        migrationsDir: 'app/migration'
    }
}

module.exports = {
    ...commonConfig,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE
}
