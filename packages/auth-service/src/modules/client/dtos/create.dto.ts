import { Expose } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'
import { OrderCreateReqGrpc } from 'protobuf/gen/ts/order-service/client/order/order'

export class OrderCreateReq implements OrderCreateReqGrpc {
    @Expose()
    @IsNotEmpty()
    @IsString()
    productId: string

    @Expose()
    @IsString()
    name: string
}
