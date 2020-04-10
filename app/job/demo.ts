export default {
    name: 'demo',
    cron: '*/5 * * * * *',
    execute: async function () {
        const user = await this.service.user.findUser(1)
        if (user) {
            const { username } = user
            console.log(`user <${username}> has been found`)
        } else {
            console.log('user not found')
        }
    },
    imediately: true
}
