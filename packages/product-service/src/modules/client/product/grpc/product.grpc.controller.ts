import {
    GetProductsReqGrpc,
    GrpcProductServer,
    GrpcProductService,
    ProductResGrpc,
} from 'protobuf/gen/ts/product-service/client/product/product'
import { ServerErrorResponse } from 'protobuf/node_modules/@grpc/grpc-js'
import { Inject, Service } from 'typedi'
import { GrpcServiceGroup } from '../../../../app'
import { grpcReq, grpcRes } from '../../../../base/base.grpc'
import { handleGrpcError } from '../../../../utils/error'
import { Pagination, ResponseWrapper } from '../../../../utils/response'
import { ProductGrpcGrpcService } from './product.grpc.service'
export type ServerErrorResponses = ServerErrorResponse & {
    codes: string
    message: string
}

@Service()
export class ProductGrpcController implements GrpcProductServer {
    [method: string]: any
    constructor(@Inject() private productGrpcService: ProductGrpcGrpcService) {}
    getProducts = async (
        req: grpcReq<GetProductsReqGrpc>,
        callback: grpcRes<ProductResGrpc>
    ) => {
        try {
            const { products, pagination } =
                await this.productGrpcService.GetProducts(
                    Pagination.fromGrpc(req)
                )
            callback(null, new ResponseWrapper(products, null, pagination))
        } catch (err) {
            handleGrpcError(err, callback)
        }
    }
}

export const productGrpcService: GrpcServiceGroup = {
    clsGrpcService: ProductGrpcController,
    clsServiceDefinition: GrpcProductService,
}
