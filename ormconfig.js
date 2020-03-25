const commonConfig = {
    type: 'mysql',
    entities: ['app/entity/**/*.ts'],
    migrations: ['app/migration/**/*.ts'],
    cli: {
        migrationsDir: 'app/migration'
    }
}

const testingConfig = Object.assign({}, commonConfig, {
    host: '',
    port: 3306,
    username: '',
    password: '',
    database: ''
})

const productionConfig = Object.assign({}, commonConfig, {
    host: '',
    port: 3306,
    username: '',
    password: '',
    database: ''
})

module.exports = process.env.NODE_ENV === 'production' ? productionConfig : testingConfig
