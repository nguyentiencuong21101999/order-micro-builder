import { GrpcProductClient } from 'protobuf/gen/ts/product-service/client/product/product'
import { Inject, Service } from 'typedi'
import { callGrpc } from '../../../base/base.grpc'
import { GrpcService } from '../../grpc-service/grpc-service'
import { GetProductsRequestDTO } from './dtos/product.dto'

@Service()
export class ProductService {
    grpcProduct: GrpcProductClient
    constructor(@Inject() private grpcService: GrpcService) {}
    getProducts = async (data: GetProductsRequestDTO) => {
        /*
        Because getProduct is normal function,
        use an arrow function or bind( this.grpcService.product)
        */
        console.log(data)
        return await callGrpc(
            data,
            this.grpcService.product.getProducts.bind(this.grpcService.product)
        )
    }
}
