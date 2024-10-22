import moment from 'moment-timezone'

export const getUTCDate = (
    dateTime?: Date,
    format: string = 'YYYY-MM-DD',
    timezone?: string
) => {
    if (!dateTime) {
        dateTime = new Date()
    }
    let dateMoment = moment.utc(dateTime)
    if (timezone) {
        dateMoment = dateMoment.tz(timezone)
    }
    return dateMoment.format(format)
}

export const setTime = (m: number = 0, dateTime?: Date): Date => {
    if (!dateTime) {
        dateTime = new Date()
    }
    const now = new Date()
    const newTime = now.setMinutes(now.getMinutes() + m)
    return new Date(newTime)
}
