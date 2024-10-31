import { OrderCreateReqGrpc } from 'protobuf/gen/ts/order-service/client/order/order'
import { Service } from 'typedi'
import { startTransaction } from '../../../database/connection'
import { genPrimaryKey } from '../../../utils/crypto'
import { OrderProduct } from './entities/order-product.entity'
import { Order } from './entities/order.entity'

@Service()
export class OrderService {
    create = async (data: OrderCreateReqGrpc) => {
        let totalQuality = 0,
            totalPrice = 0
        const { userId, userAddressId, sumNote, products } = data

        products.forEach((product) => {
            const { price, quality } = product
            totalPrice += price
            totalQuality += quality
        })

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
                },
                manager
            )

            await OrderProduct.orderProductCreate(
                products.map((product) => ({ orderId, userId, ...product })),
                manager
            )
        })
    }
}
