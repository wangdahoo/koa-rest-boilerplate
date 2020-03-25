export class ApiException extends Error {
    static API_EXCEPTION: string = 'ApiException'
    status: number
    err: Error|null
    code: number = -1

    constructor (message: string, status?: number) {
        super()
        this.name = ApiException.API_EXCEPTION
        this.message = message
        this.status = status || 400
    }

    static from (err: Error, status?: number) {
        status = status || 500
        return new ApiException(err.message, status)
    }

    toString () {
        return `ApiExcetpion: ${this.message}`
    }
}
