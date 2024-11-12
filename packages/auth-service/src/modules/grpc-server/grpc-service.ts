import { GrpcProductClient } from 'protobuf/gen/ts/product-service/client/product/product'

import { GrpcOrderClient } from 'protobuf/gen/ts/order-service/client/order/order'
import { GrpcPaymentClient } from 'protobuf/gen/ts/payment-service/client/payment/payment'
import * as grpc from 'protobuf/node_modules/@grpc/grpc-js'
import { Inject, Service } from 'typedi'
import { Config } from '../../configs'

@Service()
export class GrpcService {
    product: GrpcProductClient
    order: GrpcOrderClient
    payment: GrpcPaymentClient
    constructor(@Inject() private config: Config) {}

    initGrpcService = () => {
        const { productServicePort, orderServicePort, paymentServicePort } =
            this.config.grpcCredentials

        this.product = new GrpcProductClient(
            productServicePort,
            grpc.ChannelCredentials.createInsecure()
        )
        this.order = new GrpcOrderClient(
            orderServicePort,
            grpc.ChannelCredentials.createInsecure()
        )
        this.payment = new GrpcPaymentClient(
            paymentServicePort,
            grpc.ChannelCredentials.createInsecure()
        )
    }
}
