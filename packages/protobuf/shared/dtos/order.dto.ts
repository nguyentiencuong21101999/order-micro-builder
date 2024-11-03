import { Expose, Transform } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import { ToBoolean } from '../utils/class-transformer'
import { BaseResponseGrpcShared } from './base.response.dto'

export class OrderSharedDTO extends BaseResponseGrpcShared {
    @Expose()
    @IsString()
    orderId: string

    @Expose()
    @IsNumber()
    userId: number

    @Expose()
    @IsNumber()
    totalQuality: number

    @Expose()
    @IsOptional()
    @IsString()
    sumNote: string

    @Expose()
    @IsNumber()
    userAddressId: number

    @Expose()
    @IsNumber()
    totalProduct: number

    @Expose()
    @IsNumber()
    totalPrice: number

    @Expose()
    @IsNumber()
    status: number
    @Expose()
    @Transform(ToBoolean)
    isPaid: boolean
    @Expose()
    totalPaid: number

    static getData = <T>(data: any) => {
        return this.baseData(data, this) as T
    }
}
