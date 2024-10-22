import { Expose } from 'class-transformer'
import {
    IsDateString,
    IsEmail,
    IsOptional,
    IsString,
    Length,
    Matches
} from 'class-validator'

export class UserUpdateReqDTO {

    @Expose()
    @IsOptional()
    @IsString()
    @Length(0, 64)
    fullName: string

    @Expose()
    @IsOptional()
    @Matches(
        new RegExp(
            '^(?:\\+?(61))? ?(?:\\((?=.*\\)))?(0?[2-57-8])\\)? ?(\\d\\d(?:[- ](?=\\d{3})|(?!\\d\\d[- ]?\\d[- ]))\\d\\d[- ]?\\d[- ]?\\d{3})$'
        )
    )
    phoneNumber: string

    @Expose()
    @IsOptional()
    @IsEmail()
    @IsString()
    email: string

    @Expose()
    @IsDateString()
    @IsOptional()
    dob: string

    userId: number
}
