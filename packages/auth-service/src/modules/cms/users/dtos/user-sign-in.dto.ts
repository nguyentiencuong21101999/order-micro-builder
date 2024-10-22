import { Expose } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'

export class CMSUserSignInReqDTO {
    @Expose()
    @IsNotEmpty()
    @IsString()
    username: string

    @Expose()
    @IsNotEmpty()
    @IsString()
    password: string
}
