import { Expose, Transform } from 'class-transformer'
import { IsNumber, IsOptional } from 'class-validator'
import { GetProductsReqGrpc } from 'protobuf/gen/ts/product-service/client/product/product'
import { ToNumber } from '../../../../utils/class-transform'

export class GetProductsRequestDTO implements GetProductsReqGrpc {
    @Expose()
    @Transform(ToNumber)
    @IsOptional()
    @IsNumber()
    page: number

    @Expose()
    @Transform(ToNumber)
    @IsOptional()
    @IsNumber()
    limit: number
}
