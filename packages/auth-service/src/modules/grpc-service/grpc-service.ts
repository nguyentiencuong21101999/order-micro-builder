import { GrpcProductClient } from 'protobuf/gen/ts/product-service/client/product/product'
import * as grpc from 'protobuf/node_modules/@grpc/grpc-js'
import { Service } from 'typedi'

@Service()
export class GrpcService {
    product: GrpcProductClient

    constructor() {}

    initGrpcService = () => {
        this.product = new GrpcProductClient(
            'localhost:1006',
            grpc.ChannelCredentials.createInsecure()
        )
    }
}
