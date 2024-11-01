import { OrderCreateReqGrpc } from 'protobuf/gen/ts/order-service/client/order/order'
import { Inject, Service } from 'typedi'
import { startTransaction } from '../../../../database/connection'
import { genPrimaryKey } from '../../../../utils/crypto'
import { RabbitMQManager } from '../../../rabbit-mq/rabbit-mq'
import { RabbitQueueNames } from '../../../rabbit-mq/types/queue-name.type'
import { OrderProduct } from '../entities/order-product.entity'
import { Order } from '../entities/order.entity'
import { OrderCreatedDataQueue } from './dtos/create.dto'
import { OrderStatusType } from './types/order.type'

@Service()
export class OrderGrpcService {
    constructor(@Inject() private rabbitMqManager: RabbitMQManager) {}

    create = async (data: OrderCreateReqGrpc) => {
        let totalQuality = 0,
            totalPrice = 0
        const { userId, userAddressId, sumNote, products } = data
        const status = OrderStatusType.orderCreated

        products.forEach((product) => {
            const { price, quality } = product
            totalPrice += price
            totalQuality += quality
        })

        // Producer to Catalog Service
        const orderId = genPrimaryKey(16)
        const dataQueue: OrderCreatedDataQueue = {
            orderId,
            userId,
            products,
            status,
        }
        await this.rabbitMqManager.sendJobToQueue(
            RabbitQueueNames.orderCreated,
            dataQueue
        )
        return
        await startTransaction(async (manager) => {
            const orderId = genPrimaryKey(16)
            await Order.orderCreate(
                {
                    orderId,
                    userId,
                    userAddressId,
                    totalPrice,
                    totalQuality,
                    sumNote,
                    status,
                },
                manager
            )

            await OrderProduct.orderProductCreate(
                products.map((product) => ({ orderId, userId, ...product })),
                manager
            )

            // Producer to Catalog Service
            const dataQueue: OrderCreatedDataQueue = {
                orderId,
                userId,
                products,
                status,
            }
            await this.rabbitMqManager.sendJobToQueue(
                RabbitQueueNames.orderCreated,
                dataQueue
            )
        })
    }
}
