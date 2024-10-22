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
    UserNotFound: new ErrorResp('error.userNotFound', 'User not found.'),
    EmailInvalid: new ErrorResp('error.emailInvalid', 'Email invalid.'),
    PasswordInvalid: new ErrorResp(
        'error.passwordInvalid',
        'Password invalid.'
    ),
    UserNotVerified: new ErrorResp(
        'error.userNotVerified',
        'User not verified.'
    ),
    UserVerified: new ErrorResp('error.userVerified', 'User verified.'),
    UserDeleted: new ErrorResp('error.userDeleted', 'User deleted.'),
    MaximumSendMail: new ErrorResp(
        'error.maximumSendMail',
        'Maximum send mail.'
    ),
    OtpInvalid: new ErrorResp('error.otpInvalid', 'Otp invalid.'),
    OtpExpired: new ErrorResp('error.otpExpired', 'Otp expired.'),
    OtpUsed: new ErrorResp('error.otpUsed', 'Otp used.'),
    AccountExisted: new ErrorResp('error.accountExisted', 'Account existed.'),
    UsernameExisted: new ErrorResp(
        'error.usernameExisted',
        'Username existed.'
    ),
    EmailExisted: new ErrorResp('error.emailExisted', 'Email existed.'),
    PhoneNumberExisted: new ErrorResp(
        'error.phoneNumberExisted',
        'PhoneNumber existed.'
    ),
    AccountInvalid: new ErrorResp(
        'error.accountInvalid',
        'Username or password invalid.'
    ),
    CurrentPasswordInvalid: new ErrorResp(
        'error.currentPasswordInvalid',
        'Current password invalid.'
    ),
    ChangePasswordFailed: new ErrorResp(
        'error.changePasswordFailed',
        'Change password failed.'
    ),
    UserAddressUpdateFailed: new ErrorResp(
        'error.userAddressUpdateFailed',
        'User address update failed.'
    ),
    UserAddressDeleteFailed: new ErrorResp(
        'error.userAddressDeleteFailed',
        'User address delete failed.'
    ),
    UserAddressNotFound: new ErrorResp(
        'error.userAddressNotFound',
        'User address not found.'
    ),
    UserAddressIsDefault: new ErrorResp(
        'error.userAddressIsDefault',
        'User address is default.'
    ),
    RoleInvalid: new ErrorResp('error.roleInvalid', 'Role invalid.'),
    EmailNotFound: new ErrorResp('error.emailNotFound', 'Email not found.'),
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
