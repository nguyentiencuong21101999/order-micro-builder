import Container, { Service } from 'typedi'
import { In } from 'typeorm'
import { startTransaction } from '../../../../database/connection'
import { Errors } from '../../../../utils/error'
import { OrderStatusType } from '../../../../utils/type'
import {
    OrderTrackingJobData,
    ProductData,
} from '../../../rabbit-mq/dtos/order.dto'
import { RabbitMQManager } from '../../../rabbit-mq/rabbit-mq'
import { RabbitQueueNames } from '../../../rabbit-mq/types/queue-name.type'
import { ProductTracking } from '../entities/product-tracking.entity'
import { Product } from '../entities/product.entity'

@Service()
export class ProductConsumerService {
    constructor() {}
    checkValidProducts = async (data: OrderTrackingJobData) => {
        const { userId, orderId, products } = data
        let error = undefined

        const productMaps = {}
        const productIds = products.map(({ productId, price, quality }) => {
            productMaps[`${productId}${price}`] = quality
            return productId
        })

        await startTransaction(async (manager) => {
            const productItems = await Product.gets(
                {
                    productId: In(productIds),
                },
                manager
            )
            if (productItems?.length !== productIds.length)
                throw Errors.ProductIsNotEqual

            for (const { productId, price, quality } of productItems) {
                const pricesSetMap = `${productId}${price}`

                if (!pricesSetMap) throw Errors.ProductNotFound
                if (!productMaps[pricesSetMap]) throw Errors.PriceInvalid

                const remainingQuality = quality - productMaps[pricesSetMap]
                if (remainingQuality < 0) throw Errors.QualityNotEnough

                await Product.productUpdate(
                    { quality: remainingQuality },
                    { productId },
                    manager
                )
            }
            await ProductTracking.productTrackingCreate(
                { userId, orderId, jsonData: JSON.stringify(products) },
                manager
            )
        }).catch((err) => (error = err))

        /* Push to Catalog service */
        const orderTrackingJobData: OrderTrackingJobData = {
            ...data,
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

    handleProductCancel = async (data: OrderTrackingJobData) => {
        const { userId, orderId } = data
        let error = undefined
        try {
            const productCancel = await ProductTracking.get({ userId, orderId })
            if (!productCancel) throw Errors.ProductCancelInvalid

            const productMaps = {}
            const productIds = JSON.parse(productCancel.jsonData).map(
                (product: ProductData) => {
                    const { productId, price, quality } = product
                    productMaps[`${productId}${price}`] = quality
                    return productId
                }
            )

            await startTransaction(async (manager) => {
                const productItems = await Product.gets(
                    {
                        productId: In(productIds),
                    },
                    manager
                )
                if (productItems?.length !== productIds.length)
                    throw Errors.ProductIsNotEqual

                for (const { productId, price, quality } of productItems) {
                    const plusQuality = productMaps[`${productId}${price}`]
                    if (!quality) throw Errors.ProductNotFound

                    await Product.productUpdate(
                        { quality: quality + plusQuality },
                        { productId },
                        manager
                    )
                }
            })
        } catch (err) {
            error = err
        } finally {
            /* Push to Catalog service */
            const orderTrackingJobData: OrderTrackingJobData = {
                ...data,
                status: error
                    ? OrderStatusType.ProductCanceledFailed
                    : OrderStatusType.ProductCanceledSuccess,
                error,
            }
            await Container.get(RabbitMQManager).sendJobToQueue(
                RabbitQueueNames.ProductCanceled,
                orderTrackingJobData
            )
        }
    }
}
