import { Expose } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import { BaseResponseGrpcShared } from './base.response.dto'

export class ProductSharedDTO extends BaseResponseGrpcShared {
    @Expose()
    @IsString()
    productId: number

    @Expose()
    @IsString()
    name: string

    @Expose()
    @IsString()
    imageUrl: string

    @Expose()
    @IsNumber()
    price: number

    @Expose()
    @IsNumber()
    quality: number

    @Expose()
    @IsOptional()
    @IsString()
    note: string

    @Expose()
    @IsOptional()
    @IsString()
    attribute: string

    static getData = <T>(data: any) => {
        return this.baseData(data, this) as T
    }
}
