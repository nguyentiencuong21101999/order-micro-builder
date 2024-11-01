import {
    GrpcOrderServer,
    GrpcOrderService,
    OrderCreateReqGrpc,
    OrderCreateResGrpc,
} from 'protobuf/gen/ts/order-service/client/order/order'
import { Inject, Service } from 'typedi'
import { GrpcServiceGroup } from '../../../../app'
import { grpcReq, grpcRes } from '../../../../base/base.grpc'
import { handleGrpcError } from '../../../../utils/error'
import { ResponseWrapper } from '../../../../utils/response'
import { OrderGrpcService } from './order.service'

@Service()
export class OrderGrpcController implements GrpcOrderServer {
    [method: string]: any
    constructor(@Inject() private orderService: OrderGrpcService) {}

    create = async (
        { request }: grpcReq<OrderCreateReqGrpc>,
        callback: grpcRes<OrderCreateResGrpc>
    ) => {
        try {
            await this.orderService.create(request)
            callback(null, new ResponseWrapper(true))
        } catch (err) {
            handleGrpcError(err, callback)
        }
    }
}

export const orderGrpcService: GrpcServiceGroup = {
    clsGrpcService: OrderGrpcController,
    clsServiceDefinition: GrpcOrderService,
}