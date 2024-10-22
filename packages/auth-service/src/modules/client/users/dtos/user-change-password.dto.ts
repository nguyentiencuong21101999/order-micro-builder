import { Expose } from 'class-transformer'
import { IsNotEmpty, IsString, Matches } from 'class-validator'

export class UserChangePasswordReqDTO {
    @Expose()
    @IsNotEmpty()
    @IsString()
    currentPassword: string

    @Expose()
    @Matches(new RegExp('^((?=.*[0-9])(?=.*[a-zA-Z]).{6,})$'))
    password: string

    roleId: number

    userId: number
}
