export default {
    name: 'demo',
    cron: '*/5 * * * * *',
    execute: async function () {
        const user = await this.service.user.info(1)
        if (user) {
            const { name, email } = user
            console.log(`name: ${name}, email: ${email}`)
        } else {
            console.log('user not found')
        }
    },
    imediately: true
}
