import {
    ClassConstructor,
    instanceToPlain,
    plainToInstance,
} from 'class-transformer'
import {
    validateOrReject,
    validateSync,
    ValidationError,
} from 'class-validator'
import { NextFunction, Response } from 'express'
import { grpcReq } from '../base/base.grpc'
import { DataRequest } from '../base/base.request'
import { ErrorResp, Errors } from './error'

export const transformAndValidate = <T extends object>(
    cls: ClassConstructor<T>
) => {
    return async (req: DataRequest<T>, res: Response, next: NextFunction) => {
        try {
            const data = {
                ...req.params,
                ...req.query,
                ...req.body,
            }

            // transform data to target instance
            req.data = plainToInstance(cls, data, {
                excludeExtraneousValues: true,
            })

            // validate instance
            await validateOrReject(req.data)
            next()
        } catch (err) {
            next(parseValidationError(err))
        }
    }
}

export const transformAndValidateReqGrpc = async <Req extends Object>(
    req: grpcReq<any>,
    cls?: ClassConstructor<Req>
) => {
    try {
        const data = {
            ...req.request,
        } as Req
        // transform data to target instance
        if (cls) {
            const body = plainToInstance(cls, data, {
                excludeExtraneousValues: true,
            })
            // validate instance
            await validateOrReject(data)

            return body
        }
        return data
    } catch (err) {
        throw parseValidationError(err)
    }
}

export const handleErrorSync = (errs: ValidationError[]) => {
    if (errs.length) throw Errors.BadRequest
}

export const transformAndValidateResGrpc = <T>(
    cls: ClassConstructor<T>,
    data: any
) => {
    if (!data) return new cls()
    data[0].productId = null
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
export const parseValidationError = (err: unknown) => {
    const validationErrs = err as ValidationError[]
    if (validationErrs.length == 0) {
        return err
    }
    if (validationErrs[0]?.contexts != null) {
        const errValues = Object.values(validationErrs[0].contexts)
        if (errValues.length > 0) {
            const errResp = plainToInstance(
                ErrorResp,
                instanceToPlain(errValues[0])
            )
            if (errResp.message != null) return errResp
        }
    }
    if (validationErrs[0]?.constraints != null) {
        const constraintValues = Object.values(validationErrs[0].constraints)
        if (constraintValues.length > 0) {
            return new ErrorResp(
                Errors.BadRequest.code,
                constraintValues[0],
                Errors.BadRequest.status
            )
        }
    }
    return Errors.BadRequest
}
