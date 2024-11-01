import amqplib, { Message } from 'amqplib'
import { Inject, Service } from 'typedi'
import { OrderConsumerService } from '../client/order/consumer/order.consumer.service'
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
        const consumers = [RabbitQueueNames.orderCreated]
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
        switch (action) {
            case RabbitQueueNames.orderCreated:
                await this.orderConsumerService.handleOrderCreatedConsumer(data)
                break
        }
    }
}
