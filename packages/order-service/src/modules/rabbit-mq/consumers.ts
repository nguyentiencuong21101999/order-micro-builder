import amqplib, { Message } from 'amqplib'
import Container, { Inject, Service } from 'typedi'

import { OrderConsumerService } from '../client/order/consumer/product.consumer.service'
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
        const consumers = [RabbitQueueNames.OrderUpdate]
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

    async consumerWithHandle(action: string, data: any) {
        await this.orderConsumerService.handleOrderUpdate(data)
        switch (action) {
            case RabbitQueueNames.OrderUpdate:
                await this.orderConsumerService.handleOrderUpdate(data)
                switch (data.status) {
                    // case OrderStatusType.OrderCanceled:
                    // case OrderStatusType.OrderSucceed:
                    //     break
                    default:
                        await Container.get(RabbitMQManager).sendJobToQueue(
                            RabbitQueueNames.OrderUpdated,
                            data
                        )
                        break
                }
                break
        }
    }
}
