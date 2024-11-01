import { Service } from 'typedi'
import { In } from 'typeorm'
import { startTransaction } from '../../../../database/connection'
import { Product } from '../entities/product.entity'
import { CheckValidProductData } from './dtos/product.dto'

@Service()
export class ProductConsumerService {
    checkValidProducts = async (data: CheckValidProductData) => {
        const { orderId, products, status, userId } = data

        const productIds = products.map(({ productId }) => productId)

        await startTransaction(async (manager) => {
            const productItems = await Product.gets(
                {
                    productId: In(productIds),
                },
                manager
            )

            console.log(productItems)
        })
    }
}
