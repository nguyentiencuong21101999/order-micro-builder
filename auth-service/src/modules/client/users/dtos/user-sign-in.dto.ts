import { Expose, plainToInstance } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'
import { Request } from 'express'

export class UserSignInReqDTO {
    @Expose()
    @IsString()
    @IsNotEmpty()
    username: string

    @Expose()
    @IsNotEmpty()
    password: string

    static fromReq = (req: Request) => {
        return plainToInstance(UserSignInReqDTO, req.body, {
            excludeExtraneousValues: true,
        })
    }
}
