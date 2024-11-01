import amqplib from 'amqplib'
import { Inject, Service } from 'typedi'
import { Config } from '../../configs'
import { logger } from '../../utils/logger'

import { RabbitProducer } from './producers'
import { RabbitConsumer } from './consumers'

@Service()
export class RabbitMQManager {
    private conn: amqplib.Connection
    channel: amqplib.Channel
    constructor(
        private config: Config,
        @Inject() private rabbitConsumer: RabbitConsumer<any>,
        @Inject() private rabbitProducer: RabbitProducer<any>
    ) {}

    connect = async () => {
        this.conn = await amqplib.connect(this.config.rabbitMqUri)
        this.channel = await this.createChannel()
        await this.rabbitConsumer.setupConsumers(this.channel)

        logger.info('RabbitMQ connect successfully')
    }

    createChannel = async () => {
        if (!this.channel) return await this.conn.createChannel()
        return this.channel
    }

    sendJobToQueue = async (queueName: string, data: any) => {
        await this.rabbitProducer.produce(this.conn, queueName, data)
    }
}
