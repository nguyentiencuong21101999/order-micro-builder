import crypto, { randomUUID } from 'crypto'

export const genCodeOtp = () => {
    return crypto.randomInt(100000, 999999).toString()
}

export const genKeyOtp = () => {
    return randomUUID().replace(/-/g, '')
}
