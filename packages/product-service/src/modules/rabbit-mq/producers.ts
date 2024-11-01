import { Connection, Message } from 'amqplib'
import { Service } from 'typedi'

export interface IProducer<T extends Message> {
    produce(conn: Connection, queueName: string, data: T): Promise<void>
}

@Service()
export class RabbitProducer<T extends Message> implements IProducer<any> {
    async produce<T extends Message>(
        conn: Connection,
        queueName: string,
        data: T
    ) {
        const channel = await conn.createChannel()

        const content = Buffer.from(JSON.stringify(data))
        channel.sendToQueue(queueName, content, { persistent: true })

        await channel.close()
    }
}
