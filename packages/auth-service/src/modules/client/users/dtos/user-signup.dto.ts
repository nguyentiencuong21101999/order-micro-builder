import { Expose, plainToInstance } from 'class-transformer'
import {
    IsDateString,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
    Matches,
} from 'class-validator'
import { randomUUID } from 'crypto'
import { Request } from 'express'

import { bcryptPassword } from '../../../../utils/bcrypt'
import { User } from '../entities/user.entity'

export class UserSignupReqDTO {
    @Expose()
    @IsString()
    @Matches(
        new RegExp(
            '^(?=[a-zA-Z0-9\\.@_-]{6,48})([a-zA-Z0-9]([.@_-]?[a-zA-Z0-9])*)$'
        )
    )
    username: string

    @Expose()
    @IsString()
    @IsNotEmpty()
    password: string

    @Expose()
    @IsNotEmpty()
    @Matches(
        new RegExp(
            '^(?:\\+?(61))? ?(?:\\((?=.*\\)))?(0?[2-57-8])\\)? ?(\\d\\d(?:[- ](?=\\d{3})|(?!\\d\\d[- ]?\\d[- ]))\\d\\d[- ]?\\d[- ]?\\d{3})$'
        )
    )
    phoneNumber: string

    @Expose()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string

    @Expose()
    @IsNotEmpty()
    @IsString()
    @Length(0, 64)
    fullName: string

    @Expose()
    @IsOptional()
    @IsDateString()
    dob: string

    @Expose()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    refAffiliate: string

    static fromReq = (req: Request) => {
        return plainToInstance(UserSignupReqDTO, req.body, {
            excludeExtraneousValues: true,
        })
    }

    static toUserEntity = async (dto: any): Promise<User> => {
        const user = plainToInstance(User, dto)
        user.password = await bcryptPassword(user.password)
        user.affiliate = randomUUID()
        return user
    }
}
