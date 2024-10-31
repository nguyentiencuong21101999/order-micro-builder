import { ConsumeMessage } from 'amqplib'
import { OrderCreatedConsumer } from './consumers/order.consumer'
import { RabbitQueueNames } from './rabbit-mq'

type IConsumer = {
    [key in RabbitQueueNames]: (msg: ConsumeMessage | null) => void
}

export const Consumers: IConsumer = {
    [RabbitQueueNames.orderCreated]: OrderCreatedConsumer,
}
