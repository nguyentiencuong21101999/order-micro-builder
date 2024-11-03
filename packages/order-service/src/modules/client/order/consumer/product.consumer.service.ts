import { OrderTrackingJobDataShared } from 'protobuf/shared/dtos/catalog.dto'
import { Service } from 'typedi'
import { Order } from '../entities/order.entity'

@Service()
export class OrderConsumerService {
    constructor() {}
    handleOrderUpdate = async (data: OrderTrackingJobDataShared) => {
        const { status, orderId } = data
        await Order.orderUpdate({ status }, { orderId })
    }
}
