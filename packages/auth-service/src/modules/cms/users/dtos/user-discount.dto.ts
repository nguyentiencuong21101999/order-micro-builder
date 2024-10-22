import { Expose, Transform } from 'class-transformer'
import { IsNumber } from 'class-validator'
import { ToNumber } from '../../../../../utils/class-transform'

export class GetUserDiscountReqDTO {
    @Expose()
    @IsNumber()
    @Transform(ToNumber)
    userId: number
}
