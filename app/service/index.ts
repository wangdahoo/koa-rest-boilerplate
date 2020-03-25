import { UserService } from './user'

export interface ServiceAccessor {
    user: UserService
}

export const service: ServiceAccessor = {
    user: new UserService()
}
