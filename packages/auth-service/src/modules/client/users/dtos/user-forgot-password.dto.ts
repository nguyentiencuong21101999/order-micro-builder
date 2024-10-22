import { Expose } from 'class-transformer'
import { IsEmail, IsString } from 'class-validator'

export class UserForgotPasswordReqDTO {
    @Expose()
    @IsEmail()
    @IsString()
    email: string
}
