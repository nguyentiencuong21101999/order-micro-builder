import { Expose, Transform } from 'class-transformer'
import { IsNumber, Matches } from 'class-validator'
import { ToNumber } from '../../../../utils/class-transform'


export class CMSChangeUserPasswordReqDTO {
    @Expose()
    @Matches(new RegExp('^((?=.*[0-9])(?=.*[a-zA-Z]).{6,})$'))
    password: string

    @Expose()
    @IsNumber()
    @Transform(ToNumber)
    userId: number
}
