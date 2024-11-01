import Container, { Service } from 'typedi'
import { RabbitMQManager } from '../../../rabbit-mq/rabbit-mq'
import { OrderTracking } from '../entities/order-tracking.entity'
import { OrderCreateConsumerData } from './dtos/order-consumer.dto'
import {
    ContentByStatusOrderParse,
    OrderStatusType,
} from './types/order-consumer.type'
import { RabbitQueueNames } from '../../../rabbit-mq/types/queue-name.type'

@Service()
export class OrderConsumerService {
    handleOrderCreatedConsumer = async (data: OrderCreateConsumerData) => {
        const { orderId, status, userId } = data
        const content = ContentByStatusOrderParse[status]

        await OrderTracking.orderTrackingCreate({
            orderId,
            userId,
            status,
            content,
        })

        switch (status) {
            /* order created -> product check */
            case OrderStatusType.orderCreated:
                await Container.get(RabbitMQManager).sendJobToQueue(
                    RabbitQueueNames.ProductCheck,
                    data
                )
                break
        }
    }
}
