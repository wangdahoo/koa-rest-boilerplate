import { ServiceAccessor } from '../app/service'

declare module 'koa' {
    interface Context {
        service?: ServiceAccessor
    }
}
