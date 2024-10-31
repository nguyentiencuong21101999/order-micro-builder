import { Expose, plainToInstance } from 'class-transformer'
import {
    ArrayMinSize,
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator'
import {
    OrderCreateReqGrpc,
    OrderProductGrpc,
} from 'protobuf/gen/ts/order-service/client/order/order'

export class OrderProductCreateReq implements OrderProductGrpc {
    @Expose()
    @IsNotEmpty()
    @IsString()
    productId: string

    @Expose()
    @IsString()
    name: string

    @Expose()
    @IsNotEmpty()
    @IsString()
    imageUrl: string

    @Expose()
    @IsNumber()
    price: number

    @Expose()
    @IsNumber()
    quality: number

    @Expose()
    attributes?: string

    @Expose()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    note: string

    static toOrderProductCreateReq = (data: OrderProductCreateReq | object) => {
        return plainToInstance(OrderProductCreateReq, data, {
            excludeExtraneousValues: true,
        })
    }
}

export class OrderCreateReq implements OrderCreateReqGrpc {
    @Expose()
    @IsArray()
    @ArrayMinSize(1)
    products: OrderProductCreateReq[]

    @Expose()
    @IsOptional()
    @IsString()
    sumNote: string

    @Expose()
    @IsNotEmpty()
    @IsNumber()
    userAddressId: number

    userId: number
}
