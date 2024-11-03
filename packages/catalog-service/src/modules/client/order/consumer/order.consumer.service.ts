import { OrderTrackingJobDataShared } from 'protobuf/shared/dtos/catalog.dto'
import { Service } from 'typedi'
import { getOrderError } from '../../../../utils/error'
import { RabbitQueueNames } from '../../../rabbit-mq/types/queue-name.type'
import { OrderTracking } from '../entities/order-tracking.entity'
import { ContentByStatusOrderParse } from '../types/order-consumer.type'

@Service()
export class OrderConsumerService {
    handleOrderTrackingConsumer = async (
        action: string,
        data: OrderTrackingJobDataShared
    ) => {
        const { orderId, status, userId, error } = data
        const content = ContentByStatusOrderParse[status]
        const { code: errorCode, message: errorMessage } = getOrderError(error)

        switch (action) {
            case RabbitQueueNames.OrderCreated:
            case RabbitQueueNames.OrderUpdated:
                await OrderTracking.orderTrackingCreate({
                    orderId,
                    userId,
                    status,
                    content,
                    errorCode,
                    errorMessage,
                })
                break
        }
    }
}
