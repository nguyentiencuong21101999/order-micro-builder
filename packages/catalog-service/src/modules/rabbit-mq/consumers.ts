import amqplib, { Message } from 'amqplib'
import { OrderTrackingJobDataShared } from 'protobuf/shared/dtos/catalog.dto'
import Container, { Inject, Service } from 'typedi'
import { OrderConsumerService } from '../client/order/consumer/order.consumer.service'
import { OrderStatusType } from '../client/order/types/order-consumer.type'
import { RabbitMQManager } from './rabbit-mq'
import { RabbitQueueNames } from './types/queue-name.type'

export interface IConsumer<T extends Message> {
    createConsumer(
        channel: amqplib.Channel,
        queueName: string,
        onMessage: (msg: T | null) => Promise<void>
    ): void

    setupConsumers(channel: amqplib.Channel): void
}

export type IHandlerConsumerFunc<T> = {
    [queueName in RabbitQueueNames]?: (msg: T | null) => Promise<void>
}

@Service()
export class RabbitConsumer<T extends Message> implements IConsumer<T> {
    constructor(@Inject() private orderConsumerService: OrderConsumerService) {}

    async setupConsumers(channel: amqplib.Channel) {
        const consumers = [
            RabbitQueueNames.OrderCreated,
            RabbitQueueNames.ProductChecked,
            RabbitQueueNames.OrderUpdated,
        ]
        await Promise.all(
            consumers.map(async (queueName) => {
                await this.createConsumer(channel, queueName)
            })
        )
    }

    createConsumer = async <T extends Message>(
        channel: amqplib.Channel,
        queueName: string
    ) => {
        await channel.assertQueue(queueName, { durable: true })
        await channel.consume(queueName, async (msg) => {
            try {
                const data = JSON.parse(msg.content.toString())
                await this.consumerWithHandle(queueName, data)
            } finally {
                channel.ack(msg)
            }
        })
    }

    async consumerWithHandle(
        action: string,
        data: OrderTrackingJobDataShared | any
    ) {
        await this.orderConsumerService.handleOrderTrackingConsumer(
            action,
            data
        )

        const { status } = data
        console.log(status, action)
        switch (action) {
            case RabbitQueueNames.OrderCreated:
                await Container.get(RabbitMQManager).sendJobToQueue(
                    RabbitQueueNames.ProductCheck,
                    data
                )
                break
            case RabbitQueueNames.ProductChecked:
                await Container.get(RabbitMQManager).sendJobToQueue(
                    RabbitQueueNames.OrderUpdate,
                    data
                )
                break
            case RabbitQueueNames.OrderUpdated:
                switch (status) {
                    case OrderStatusType.ProductCheckedSuccess:
                        break
                    case OrderStatusType.ProductCheckedFailed:
                        data.status = OrderStatusType.OrderCanceled
                        await Container.get(RabbitMQManager).sendJobToQueue(
                            RabbitQueueNames.OrderUpdate,
                            data
                        )
                        break
                }

                break
        }
    }
}
