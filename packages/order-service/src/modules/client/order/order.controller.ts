import {
    GrpcOrderServer,
    GrpcOrderService,
    OrderCreateReqGrpc,
    OrderCreateResGrpc,
} from 'protobuf/gen/ts/order-service/client/order/order'
import { Inject, Service } from 'typedi'
import { GrpcServiceGroup } from '../../../app'
import { grpcReq, grpcRes } from '../../../base/base.grpc'
import { handleGrpcError } from '../../../utils/error'
import { ResponseWrapper } from '../../../utils/response'
import { OrderCreateReq } from './dtos/create.dto'
import { OrderService } from './order.service'

@Service()
export class OrderController implements GrpcOrderServer {
    [method: string]: any
    constructor(@Inject() private orderService: OrderService) {}

    create = async (
        { request }: grpcReq<OrderCreateReqGrpc>,
        callback: grpcRes<OrderCreateResGrpc>
    ) => {
        try {
            const payload = await OrderCreateReq.getData<OrderCreateReqGrpc>(
                request
            )
            
            await this.orderService.create(payload)
            callback(null, new ResponseWrapper(1))
        } catch (err) {
            handleGrpcError(err, callback)
        }
    }
}

export const orderGrpcService: GrpcServiceGroup = {
    clsGrpcService: OrderController,
    clsServiceDefinition: GrpcOrderService,
}
