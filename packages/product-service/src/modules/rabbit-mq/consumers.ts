import amqplib, { Message } from 'amqplib'
import { Inject, Service } from 'typedi'
import { ProductConsumerService } from '../client/product/consumer/product.consumer.service'
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
    constructor(
        @Inject() private productConsumerService: ProductConsumerService
    ) {}

    async setupConsumers(channel: amqplib.Channel) {
        const consumers = [RabbitQueueNames.ProductCheck]
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
            case RabbitQueueNames.ProductCheck:
                await this.productConsumerService.checkValidProducts(data)
                break
        }
    }
}
