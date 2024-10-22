import { Expose, plainToInstance } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'
import { Request } from 'express'

export class UserVerificationReqDTO {
    @Expose()
    @IsNotEmpty()
    @IsString()
    email: string

    @Expose()
    @IsNotEmpty()
    @IsString()
    key: string

    @Expose()
    @IsNotEmpty()
    @IsString()
    code: string

    static fromReq = async (req: Request) => {
        return plainToInstance(UserVerificationReqDTO, req.body, {
            excludeExtraneousValues: true,
        })
    }
}
