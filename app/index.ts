import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import helmet from 'koa-helmet'
import router from './router'
import config from './config'
import { createConnection } from 'typeorm'
import { ScheduleJob, ScheduleJobOptions } from './job'
import fs from 'fs'
import path from 'path'
import { service } from './service'
import { accessLogger, extendedContext, auth } from './middleware'
import { logger } from './logger'
import cluster from 'cluster'
import os from 'os'

enum ApplicationType {
    Web = 'web',
    Job = 'job'
}

export interface ApplicationOptions {
    type: ApplicationType
    jobName?: string
    ready?: () => Promise<void>
}

export class Application {
    private static JOB_DIR: string = path.resolve(__dirname, './job')

    private appType: ApplicationType
    private jobName: string
    private app: Koa | ScheduleJob
    private ready: () => Promise<void>

    constructor (options: ApplicationOptions) {
        this.appType = options.type
        this.jobName = options.jobName || ''
        this.ready = options.ready || (() => Promise.resolve())

        switch (this.appType) {
        case ApplicationType.Web:
            this.prepareWeb()
            break
        case ApplicationType.Job:
            this.prepareJob()
            break
        default:
            console.error(
                `Wrong AppliationType! ApplicationType should only be ${ApplicationType.Web} or ${ApplicationType.Job}`
            )
        }
    }

    private prepareWeb () {
        const app = new Koa()

        // Basic Middlewares
        app.use(helmet())
        app.use(bodyParser())
        app.use(cors())

        // accessLogger
        app.use(accessLogger)

        // extendedContext
        app.use(extendedContext)

        // auth
        app.use(auth)

        // Setup Routes
        app.use(router.routes()).use(router.allowedMethods())

        // Setup Error Logger
        app.on('error', (err, ctx) => {
            if (process.env.NODE_ENV === 'development') {
                console.error(err)
            }
            logger.error(err, err.stack)
        })

        this.app = app
    }

    private prepareJob () {
        const jobs = this.getAvailiableJobs()
        const jobName = this.jobName

        if (!jobName || jobs.indexOf(jobName) === -1) {
            console.info('job not defined.\n')
            let i = 0
            console.info('========== Available Jobs ==========')
            while (i < jobs.length) console.info(jobs[i++])
            console.info('\n')
        } else {
            const jobOptions = this.loadScheduleJobOptions(jobName)
            this.app = new ScheduleJob(jobOptions)
        }
    }

    private getAvailiableJobs () {
        return fs.readdirSync(Application.JOB_DIR).map(j => j.replace('.ts', ''))
    }

    private loadScheduleJobOptions (jobName: string) {
        const scheduleJobOptions = require(path.resolve(__dirname, Application.JOB_DIR, jobName)).default
        return scheduleJobOptions as ScheduleJobOptions
    }

    start () {
        createConnection(config.typeorm)
            .then(async _ => {
                if (this.appType === ApplicationType.Web) {
                    ;(this.app as Koa).listen(config.web.port)
                    if (cluster.isMaster) {
                        logger.info(`========== Web Server Started. Listen on Port: ${config.web.port} ==========\n`)
                    }
                }

                if (this.appType === ApplicationType.Job) {
                    ;(this.app as ScheduleJob).run()
                    logger.info(`========== Job Started. JobName: ${this.jobName} ==========\n`)
                }

                if (this.ready) {
                    await this.ready()
                }
            })
            .catch(e => console.log('error: ', e))
    }
}

// 启动程序
function bootstrap () {
    const jobName = process.env.JOB || ''

    const type = (() => {
        const argv = process.argv
        return argv[argv.length - 1] === ApplicationType.Job && jobName ? ApplicationType.Job : ApplicationType.Web
    })()

    new Application({
        type,
        jobName,
        ready: async () => {
            await service.user.createDefaultSuperUser()
        }
    }).start()
}

if (process.env.NODE_ENV !== 'development') {
    const cpuNum = os.cpus().length

    if (cluster.isMaster) {
        logger.info(`Master ${process.pid} started`)
        fs.writeFileSync(`${process.cwd()}/venus.pid`, process.pid)

        let up = 0
        for (let i = 0; i < cpuNum; i++) {
            const worker = cluster.fork()

            worker.on('online', () => {
                logger.info(`Worker ${worker.process.pid} started`)
                up++

                if (up === cpuNum) {
                    logger.info(`Total ${up} workers started`)
                }
            })
        }

        cluster.on('exit', (worker, code, signal) => {
            logger.info(`worker ${worker.process.pid} died`)
        })
    } else {
        bootstrap()
    }
} else {
    // 本地开发环境直接起
    bootstrap()
}
