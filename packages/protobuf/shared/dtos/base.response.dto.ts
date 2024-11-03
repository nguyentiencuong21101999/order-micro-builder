import {
    ClassConstructor,
    Expose,
    plainToInstance,
    Transform,
} from 'class-transformer'
import { validateSync, ValidationError } from 'class-validator'
import { toDateTimeBaseResponse } from '../utils/class-transformer'

export class BaseResponseGrpcShared {
    @Expose()
    createdBy: number

    @Expose()
    @Transform(toDateTimeBaseResponse)
    createdDate: string

    @Expose()
    updatedBy: number

    @Expose()
    @Transform(toDateTimeBaseResponse)
    updatedDate: string

    static baseData = <T>(data: any, cls: ClassConstructor<T>) => {
        return transformAndValidateResGrpc(cls, data)
    }
}

export const handleErrorSync = (errs: ValidationError[]) => {
    if (errs.length) throw new Error(errs[0]?.constraints?.toString())
}

export const transformAndValidateResGrpc = <T>(
    cls: ClassConstructor<T>,
    data: any
) => {
    if (!data) return new cls()
    try {
        const res = plainToInstance(cls, data, {
            excludeExtraneousValues: true,
        })
        if (Array.isArray(res)) {
            if (!data?.length) return [] as T
            res.forEach((data) => {
                handleErrorSync(validateSync(data))
            })
        } else {
            handleErrorSync(validateSync(res as object))
        }

        return res
    } catch (_) {
        return
    }
}
