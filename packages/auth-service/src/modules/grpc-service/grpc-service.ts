import { GrpcProductClient } from 'protobuf/gen/ts/product-service/client/product/product'

import { GrpcOrderClient } from 'protobuf/gen/ts/order-service/client/order/order'
import * as grpc from 'protobuf/node_modules/@grpc/grpc-js'
import { Inject, Service } from 'typedi'
import { Config } from '../../configs'

@Service()
export class GrpcService {
    product: GrpcProductClient
    order: GrpcOrderClient
    constructor(@Inject() private config: Config) {}

    initGrpcService = () => {
        const { productServicePort, orderServicePort } =
            this.config.grpcCredentials
        this.product = new GrpcProductClient(
            productServicePort,
            grpc.ChannelCredentials.createInsecure()
        )
        this.order = new GrpcOrderClient(
            orderServicePort,
            grpc.ChannelCredentials.createInsecure()
        )
    }
}
