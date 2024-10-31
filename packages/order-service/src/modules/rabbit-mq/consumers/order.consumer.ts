import amqplib from 'amqplib'

export const OrderCreatedConsumer = async (msg: amqplib.ConsumeMessage) => {
    console.log(msg.content.toString())
}
