import { CronJob } from 'cron'
import moment from 'moment'
import { service as serviceAccessor, ServiceAccessor } from './service'

export interface ScheduleJobOptions {
    name: string,
    cron: string,
    execute: () => void,
    immediately: boolean
}

export class ScheduleJob {
    private name: string = ''
    private cron: string = ''
    private immediately: boolean = true
    private execute: () => void|Promise<void>
    private service: ServiceAccessor = serviceAccessor

    // the cron job
    private cronjob: CronJob | null

    constructor (options: ScheduleJobOptions) {
        this.name = options.name
        this.cron = options.cron
        this.execute = options.execute
        this.immediately = options.immediately
    }

    run () {
        console.log(`job ${this.name} started at ${moment().format('YYYY-MM-DD HH:mm:ss')}`)

        if (this.immediately) {
            this.execute.call(this) // eslint-disable-line
        }

        if (this.cron) {
            this.cronjob = new CronJob(this.cron, () => this.execute.call(this)) // eslint-disable-line
            this.cronjob.start()
        }
    }
}
