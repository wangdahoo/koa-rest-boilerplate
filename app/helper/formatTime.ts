import moment from 'moment'

const isDate = (target: any) => Object.prototype.toString.call(target) === '[object Date]'

const format = (date: Date) => moment(date).format('YYYY-MM-DD HH:mm:ss')

export const formatTime = (target: any) => ({
    ...target,
    ...(isDate(target.create_time) ? { create_time: format(target.create_time) } : {}),
    ...(isDate(target.update_time) ? { update_time: format(target.create_time) } : {})
})
