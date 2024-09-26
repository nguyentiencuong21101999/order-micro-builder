import { Expose, Transform, plainToInstance } from 'class-transformer'
import { ToBoolean } from '../../../../utils/class-transform'
import { User } from '../entities/user.entity'

export class UserResDTO {
    @Expose() username: string
    @Expose() email: string
    @Expose() phoneNumber: string
    @Expose() fullName: string
    @Expose() dob: Date
    @Expose() affiliate: string
    @Expose() refAffiliate: string
    @Expose() commission: string
    @Expose() @Transform(ToBoolean) isEmailVerified: boolean
    @Expose() @Transform(ToBoolean) isPhoneVerified: boolean
    @Expose() status: number
    @Expose() roleId: number
    @Expose() accessToken: string

    static transferUserDTO = (dto: any) => {
        return plainToInstance(UserResDTO, dto, {
            excludeExtraneousValues: true,
        })
    }

    static fromUser = (dto: User): UserResDTO => {
        return plainToInstance(UserResDTO, dto, {
            excludeExtraneousValues: true,
        })
    }
}
