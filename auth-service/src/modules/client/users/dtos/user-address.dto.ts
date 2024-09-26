import { Expose, Transform } from 'class-transformer'
import {
    IsIn,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Length,
    Matches,
} from 'class-validator'

import { ToNumber } from '../../../../utils/class-transform'
import { UserAddressType } from '../types/user-address.type'

export class CreateUserAddressReqDTO {
    @Expose()
    @IsNotEmpty()
    @IsString()
    @Length(0, 64)
    fullName: string

    @Expose()
    @IsNotEmpty()
    @Matches(
        new RegExp(
            '^(?:\\+?(61))? ?(?:\\((?=.*\\)))?(0?[2-57-8])\\)? ?(\\d\\d(?:[- ](?=\\d{3})|(?!\\d\\d[- ]?\\d[- ]))\\d\\d[- ]?\\d[- ]?\\d{3})$'
        )
    )
    @IsString()
    phoneNumber: string

    @Expose()
    @IsNotEmpty()
    @IsString()
    ward: string

    @Expose()
    @IsNotEmpty()
    @IsString()
    wardCode: string

    @Expose()
    @IsNotEmpty()
    @IsString()
    district: string

    @Expose()
    @IsNotEmpty()
    @IsString()
    districtCode: string

    @Expose()
    @IsNotEmpty()
    @IsString()
    city: string

    @Expose()
    @IsNotEmpty()
    @IsString()
    cityCode: string

    @Expose()
    @IsNotEmpty()
    @IsString()
    address: string

    @Expose()
    @IsOptional()
    @IsString()
    type: number

    userId: number
}

export class DeleteUserAddressReqDTO {
    @Expose()
    @IsNumber()
    @Transform(ToNumber)
    userAddressId: number

    userId: number
}

export class UpdateDefaultUserAddressReqDTO {
    @Expose()
    @IsNumber()
    @Transform(ToNumber)
    userAddressId: number

    userId: number
}

export class UpdateUserAddressReqDTO {
    @Expose()
    @IsNumber()
    @Transform(ToNumber)
    userAddressId: number

    @Expose()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @Length(0, 64)
    fullName: string

    @Expose()
    @IsOptional()
    @IsNotEmpty()
    @Matches(
        new RegExp(
            '^(?:\\+?(61))? ?(?:\\((?=.*\\)))?(0?[2-57-8])\\)? ?(\\d\\d(?:[- ](?=\\d{3})|(?!\\d\\d[- ]?\\d[- ]))\\d\\d[- ]?\\d[- ]?\\d{3})$'
        )
    )
    @IsString()
    phoneNumber: string

    @Expose()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    ward: string

    @Expose()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    wardCode: string

    @Expose()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    district: string

    @Expose()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    districtCode: string

    @Expose()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    city: string

    @Expose()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    cityCode: string

    @Expose()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    address: string

    @Expose()
    @IsOptional()
    @IsOptional()
    @IsString()
    type: number

    userId: number
}

export class updateDefaultUserAddressReqDTO {
    @Expose()
    @IsOptional()
    @IsIn([UserAddressType.Init, UserAddressType.Default])
    isDefault: number
}
