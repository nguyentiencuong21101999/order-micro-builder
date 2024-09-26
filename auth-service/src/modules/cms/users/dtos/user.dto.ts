import { Expose, Transform, plainToInstance } from 'class-transformer'
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator'
import { UserStatusType } from '../../../client/users/types/user.type'
import { ToNumber } from '../../../../utils/class-transform'
import { BySortType } from '../../../../base/base.entities'
import { Pagination } from '../../../../utils/response'
import { BaseResponse } from '../../../../base/base.response'

/* user list */
export class CMSGetUsersReqDTO {
    @Expose()
    @IsOptional()
    @Transform(ToNumber)
    @IsIn([UserStatusType.Init, UserStatusType.Deleted])
    status: number

    @Expose()
    @IsOptional()
    @IsString()
    search: string

    @Expose()
    @IsOptional()
    @IsString()
    order: string

    @Expose()
    @IsOptional()
    @IsString()
    @IsIn([BySortType.ASC, BySortType.DESC])
    by: BySortType.ASC | BySortType.DESC

    pagination: Pagination
    adminId?: number
}

export class CMSUsersResDTO extends BaseResponse {
    @Expose() userId: number
    @Expose() username: string
    @Expose() phoneNumber: string
    @Expose() email: string
    @Expose() fullName: string
    @Expose() isEmailVerified: string
    @Expose() isPhoneVerified: string
    @Expose() status: string
    @Expose() dob: string
    @Expose() affiliate: string
    @Expose() commission: string
    @Expose() roleId: string

    static transferData = <T>(data: unknown) => {
        return plainToInstance(CMSUsersResDTO, data, {
            excludeExtraneousValues: true,
        }) as T
    }
}

/* user detail */
export class CMSGetUserDetailReqDTO {
    @Expose()
    @IsNumber()
    @Transform(ToNumber)
    userId: number
}

export class CMSUserDetailResDTO extends CMSUsersResDTO {
    @Expose() address: number

    static transferData = <T>(data: unknown) => {
        return plainToInstance(CMSUserDetailResDTO, data, {
            excludeExtraneousValues: true,
        }) as T
    }
}
