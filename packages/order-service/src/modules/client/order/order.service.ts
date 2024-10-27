import { OrderCreateReqGrpc } from 'protobuf/gen/ts/order-service/client/order/order'
import { Service } from 'typedi'

@Service()
export class OrderService {
    create = async (data: OrderCreateReqGrpc) => {
        console.log(data)
    }
}
