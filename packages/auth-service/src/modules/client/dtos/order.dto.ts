import { Expose, Transform } from 'class-transformer'
import { IsNumber, IsOptional } from 'class-validator'
import { GetOrdersReqGrpc } from 'protobuf/gen/ts/order-service/client/order/order'
import { ToNumber } from '../../../utils/class-transform'

export class GetOrdersReq implements GetOrdersReqGrpc {
    @Expose()
    @IsOptional()
    @Transform(ToNumber)
    @IsNumber()
    limit: number

    @Expose()
    @IsOptional()
    @Transform(ToNumber)
    @IsNumber()
    page: number

    @Expose()
    @IsOptional()
    @Transform(ToNumber)
    @IsNumber()
    userId: number
}
