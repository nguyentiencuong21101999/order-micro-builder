export enum RabbitQueueNames {
    orderCreated = 'order-created',
}

import amqplib from 'amqplib'
import { Service } from 'typedi'
import { Config } from '../../configs'
import { logger } from '../../utils/logger'
import { Consumers } from './consumers'

@Service()
export class RabbitMQManager {
    private conn: amqplib.Connection
    channel: amqplib.Channel
    constructor(private config: Config) {}

    connect = async () => {
        this.conn = await amqplib.connect(this.config.rabbitMqUri)
        this.channel = await this.conn.createChannel()
        logger.info('RabbitMQ connect successfully')
    }

    createChannel = async () => {
        const rabbitQueueNames = Object.values(RabbitQueueNames)

        await Promise.all(
            rabbitQueueNames.map(async (queueName) => {
                await this.channel.assertQueue(queueName, { durable: true })
                await this.channel.consume(queueName, Consumers[queueName], {
                    noAck: true,
                })
            })
        )
    }
}
