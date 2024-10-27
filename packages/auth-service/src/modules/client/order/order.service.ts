import { Inject, Service } from 'typedi'
import { callGrpc } from '../../../base/base.grpc'
import { GrpcService } from '../../grpc-service/grpc-service'
import { OrderCreateReq } from '../dtos/create.dto'

@Service()
export class OrderService {
    constructor(@Inject() private grpcService: GrpcService) {}
    create = async (data: OrderCreateReq) => {
        /*
        Because getProduct is normal function,
        use an arrow function or bind( this.grpcService.product)
        */
        return await callGrpc(
            data,
            this.grpcService.order.create.bind(this.grpcService.order)
        )
    }
}
