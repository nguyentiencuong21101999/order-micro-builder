import Container, { Service } from 'typedi'
import { In } from 'typeorm'
import { startTransaction } from '../../../../database/connection'
import { Errors } from '../../../../utils/error'
import { OrderStatusType } from '../../../../utils/type'
import { OrderTrackingJobData } from '../../../rabbit-mq/dtos/order.dto'
import { RabbitMQManager } from '../../../rabbit-mq/rabbit-mq'
import { RabbitQueueNames } from '../../../rabbit-mq/types/queue-name.type'
import { Product } from '../entities/product.entity'

@Service()
export class ProductConsumerService {
    constructor() {}
    checkValidProducts = async (data: OrderTrackingJobData) => {
        const { orderId, userId, products } = data
        let error = undefined

        const pricesSet: Set<String> = new Set()
        const productIds = products.map(({ productId, price }) => {
            pricesSet.add(`${productId}${price}`)
            return productId
        })

        await startTransaction(async (manager) => {
            const productItems = await Product.gets(
                {
                    productId: In(productIds),
                },
                manager
            )
            if (!productItems?.length) throw Errors.ProductNotFound

            for (const { productId, price, quality } of productItems) {
                const pricesSetMap = `${productId}${price}`

                if (!pricesSetMap) throw Errors.ProductNotFound
                if (!pricesSet.has(pricesSetMap)) throw Errors.PriceInvalid
                if (!quality) throw Errors.QualityNotEnough

                await Product.productUpdate(
                    { quality: quality - 1 },
                    { productId },
                    manager
                )
            }
        }).catch((err) => (error = err))

        /* Push to Catalog service */
        const orderTrackingJobData: OrderTrackingJobData = {
            orderId,
            userId,
            status: error
                ? OrderStatusType.ProductCheckedFailed
                : OrderStatusType.ProductCheckedSuccess,
            error,
        }
        await Container.get(RabbitMQManager).sendJobToQueue(
            RabbitQueueNames.ProductChecked,
            orderTrackingJobData
        )
    }
}
