import { Expose } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { ProductGrpc } from 'protobuf/gen/ts/product-service/client/product/product'
import { BaseResponseGrpc } from '../../../../base/base.grpc'

export class ProductDTO extends BaseResponseGrpc implements ProductGrpc {
    @Expose()
    @IsString()
    productId: number

    @Expose()
    @IsString()
    name: string

    @Expose()
    @IsOptional()
    @IsString()
    imageUrl: string

    @Expose()
    @IsNumber()
    price: number

    @Expose()
    @IsNumber()
    quality: number

    static getData = async <T>(data: any) => {
        return ((await this.baseData(data, this)) || []) as T
    }
}

export class ProductDTOs {
    @Expose()
    @IsNumber()
    productId: number

    @Expose()
    @IsNotEmpty()
    @IsString()
    name: string

    @Expose()
    @IsOptional()
    @IsString()
    imageUrl: string
}
