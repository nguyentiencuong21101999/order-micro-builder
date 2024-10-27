import { Expose } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'
import { OrderCreateReqGrpc } from 'protobuf/gen/ts/order-service/client/order/order'
import { BaseResponseGrpc } from '../../../../base/base.grpc'

export class OrderCreateReq
    extends BaseResponseGrpc
    implements OrderCreateReqGrpc
{
    @Expose()
    @IsNotEmpty()
    @IsString()
    productId: string

    @Expose()
    @IsString()
    name: string

    // @Expose()
    // @IsOptional()
    // @IsString()
    // imageUrl: string

    // @Expose()
    // @IsNumber()
    // price: number

    // @Expose()
    // @IsNumber()
    // quality: number

    static getData = async <T>(data: any) => {
        return ((await this.baseData(data, this)) || []) as T
    }
}
