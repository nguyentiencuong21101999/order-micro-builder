import { OrderProductGrpc } from 'protobuf/gen/ts/order-service/client/order/order'

// export class OrderCreateReq
//     extends BaseResponseGrpc
//     implements OrderCreateReqGrpc
// {
//     @Expose()
//     @IsNotEmpty()
//     @IsString()
//     productId: string

//     @Expose()
//     @IsString()
//     name: string

//     // @Expose()
//     // @IsOptional()
//     // @IsString()
//     // imageUrl: string

//     // @Expose()
//     // @IsNumber()
//     // price: number

//     // @Expose()
//     // @IsNumber()
//     // quality: number

//     static getData = async <T>(data: any) => {
//         return ((await this.baseData(data, this)) || []) as T
//     }
// }

export class OrderCreatedDataQueue {
    orderId: string
    userId: number
    status: number
    products: OrderProductGrpc[]
}
