import { Expose, plainToInstance } from 'class-transformer'
import { Response } from 'express'
import { grpcRes } from '../base/base.grpc'
import { logger } from './logger'
import { ResponseWrapper } from './response'

export class ErrorResp extends Error {
    @Expose()
    readonly status: number

    @Expose()
    readonly code: string

    @Expose()
    readonly message: string

    constructor(code: string, message: string, status?: number) {
        super()
        this.status = status
        this.code = code
        this.message = message
        this.stack = undefined
    }
}

export const Errors = {
    BadRequest: new ErrorResp('error.badRequest', 'Bad request', 400),
    Unauthorized: new ErrorResp('error.unauthorized', 'Unauthorized', 401),
    Forbidden: new ErrorResp('error.forbiden', 'Forbidden', 403),
    Sensitive: new ErrorResp(
        'error.sensitive',
        'An error occurred, please try again later.',
        400
    ),
    InternalServerError: new ErrorResp(
        'error.internalServerError',
        'Internal server error.',
        500
    ),
    InvalidFileType: new ErrorResp(
        'error.invalidFileType',
        'Invalid file type.'
    ),
    PriceInvalid: new ErrorResp('error.priceInvalid', 'Price Invalid .'),
    QualityNotEnough: new ErrorResp(
        'error.qualityNotEnough',
        'Quality not enough .'
    ),
    ProductNotFound: new ErrorResp(
        'error.productNotFound',
        'Product not found.'
    ),
}

export const handleError = (err: Error, res: Response) => {
    if (err instanceof ErrorResp) {
        const errResp = err as ErrorResp
        res.status(errResp.status || Errors.BadRequest.status).send(
            new ResponseWrapper(
                null,
                plainToInstance(ErrorResp, errResp, {
                    excludeExtraneousValues: true,
                })
            )
        )
    } else {
        logger.error(JSON.stringify(err))
        // if (config.isProduction()) {
        //     res.status(Errors.Sensitive.status).send(
        //         new ResponseWrapper(null, Errors.Sensitive)
        //     )
        //     return
        // }
        const errResp = new ErrorResp(
            Errors.InternalServerError.code,
            JSON.stringify(err),
            Errors.InternalServerError.status
        )
        res.status(Errors.Sensitive.status).send(
            new ResponseWrapper(null, errResp)
        )
    }
}

export const handleGrpcError = (err: Error, callback: grpcRes<any>) => {
    if (err instanceof ErrorResp) {
        err = { status: Errors.BadRequest.status, ...err }
        const errResp = err as ErrorResp
        callback(
            new Error(
                JSON.stringify(
                    plainToInstance(ErrorResp, errResp, {
                        excludeExtraneousValues: true,
                    })
                )
            )
        )
    } else {
        logger.error(JSON.stringify(err))
        // if (config.isProduction()) {
        //     res.status(Errors.Sensitive.status).send(
        //         new ResponseWrapper(null, Errors.Sensitive)
        //     )
        //     return
        // }
        const errResp = new ErrorResp(
            Errors.InternalServerError.code,
            JSON.stringify(err),
            Errors.InternalServerError.status
        )

        callback(new Error(JSON.stringify(errResp)))
    }
}
