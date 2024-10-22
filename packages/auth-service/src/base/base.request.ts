import { Request } from 'express'
import 'reflect-metadata'
import { AuthRequest } from '../modules/auth/auth.middleware'
export interface DataRequest<T> extends AuthRequest {
    data: T
}

export const getParamsRequest = <T>(
    req: Request,
    name: string,
    dataType: 'number' | 'string' = 'string'
): T => {
    let param = req.params[name] as T
    if (dataType === 'number') {
        return !isNaN(Number(param)) ? (Number(param) as T) : null
    }
    return (param as T) ?? null
}
