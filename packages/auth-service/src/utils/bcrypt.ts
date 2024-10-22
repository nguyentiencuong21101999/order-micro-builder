import bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'

export const bcryptPassword = (password: string) => {
    return bcrypt.hash(password, 10)
}

export const comparePassword = (
    comparePassword: string,
    password: string
): boolean => {
    return bcrypt.compareSync(comparePassword, password)
}

export const genPassword = () => {
    return randomUUID()
}
