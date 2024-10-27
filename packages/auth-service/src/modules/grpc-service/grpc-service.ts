import { GrpcProductClient } from 'protobuf/gen/ts/product-service/client/product/product'

import { GrpcOrderClient } from 'protobuf/gen/ts/order-service/client/order/order'
import * as grpc from 'protobuf/node_modules/@grpc/grpc-js'
import { Service } from 'typedi'

@Service()
export class GrpcService {
    product: GrpcProductClient
    order: GrpcOrderClient
    constructor() {}

    initGrpcService = () => {
        this.product = new GrpcProductClient(
            'localhost:1006',
            grpc.ChannelCredentials.createInsecure()
        )
        this.order = new GrpcOrderClient(
            'localhost:1007',
            grpc.ChannelCredentials.createInsecure()
        )
    }
}
