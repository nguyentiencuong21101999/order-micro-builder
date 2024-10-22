import { ClassConstructor, plainToInstance } from 'class-transformer'
import humps from 'humps'
import { AppDataSource } from './connection'
export const Procs = {
    /** sp_user_getProfile(pUserId) */
    getUserDetail: 'usp_user_getUserDetail',
}

export class CustomQueryOptions {
    plain?: boolean
}
export const execProc = async <T>(
    cls: ClassConstructor<T>,
    procName: string,
    params: unknown[],
    opts?: CustomQueryOptions,
    manager = AppDataSource.manager
): Promise<T> => {
    const qs: string[] = new Array(params.length).fill('?')
    const [result] = await manager.query(
        `CALL ${procName}(${qs.join(',')})`,
        params
    )
    if (opts?.plain) {
        return plainToInstance(cls, humps.camelizeKeys(result[0]), {
            excludeExtraneousValues: true,
        }) as T
    }

    return plainToInstance(cls, humps.camelizeKeys(result), {
        excludeExtraneousValues: true,
    }) as T
}


