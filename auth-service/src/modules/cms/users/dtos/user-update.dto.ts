import { Expose, Transform } from 'class-transformer'
import {
    IsDateString,
    IsEmail,
    IsIn,
    IsNumber,
    IsOptional,
    IsString,
    Length,
    Matches,
} from 'class-validator'
import { UserRoleType } from '../../../client/users/types/user-role.type'
import { ToNumber } from '../../../../utils/class-transform'

export class CMSUserUpdateReqDTO {
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

    @Expose()
    @IsNumber()
    @IsOptional()
    @IsIn([UserRoleType.Admin, UserRoleType.CustomerSupport, UserRoleType.User])
    roleId: number

    @Expose()
    @IsNumber()
    @Transform(ToNumber)
    userId: number
}
