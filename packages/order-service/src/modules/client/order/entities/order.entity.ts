import {
    Column,
    Entity,
    EntityManager,
    PrimaryColumn,
    SelectQueryBuilder,
} from 'typeorm'
import { BaseEntities } from '../../../../base/base.entities'
import { createQueryBuilder } from '../../../../database/connection'
import { Pagination } from '../../../../utils/response'
import { GetOrdersRes } from '../grpc/dtos/get-order.dto'
import { OrderProduct } from './order-product.entity'

@Entity('Order')
export class Order extends BaseEntities {
    @PrimaryColumn({ type: 'varchar' })
    orderId: number

    @Column({ type: 'int' })
    userId: number

    @Column({ type: 'int' })
    totalQuality: string

    @Column({ type: 'double', precision: 10, scale: 2, default: 0 })
    totalPrice: number

    @Column({ type: 'varchar' })
    sumNote: string

    @Column({ type: 'int' })
    userAddressId: number

    @Column({ type: 'smallint', default: 0 })
    status: number

    @Column({ type: 'tinyint', default: 0 })
    isPaid: number

    @Column({ type: 'double', precision: 10, scale: 2, default: 0 })
    totalPaid: number

    static async getOrders(userId: number, pagination?: Pagination) {
        const [total, orders] = await createQueryBuilder(
            'slave',
            async (builder) => {
                const queryBuilder: SelectQueryBuilder<Order> = builder
                    .select([
                        'o.*',
                        `JSON_ARRAYAGG(
                            JSON_OBJECT( 
                            'productId', op.productId, 
                            'name', op.name, 
                            'price', op.price,
                            'imageUrl',op.imageUrl, 
                            'quality', op.quality, 
                            'createdDate', op.createdDate,
                            'createdBy', op.createdBy,
                            'updatedDate', op.updatedDate,
                            'updatedBy', op.updatedBy 
                            )
					    ) AS products`,
                    ])
                    .from(Order, 'o')
                    .innerJoin(OrderProduct, 'op', 'o.orderId = op.orderId')
                    .where('o.userId = :userId', {
                        userId,
                    })
                    .groupBy('o.orderId')
                    .orderBy('o.createdDate', 'DESC')
                    .offset(pagination.getOffset())
                    .limit(pagination.limit)

                return Promise.all([
                    queryBuilder.getCount(),
                    queryBuilder.getRawMany(),
                ])
            }
        )

        pagination.total = total ?? 0
        return {
            data: GetOrdersRes.getData<GetOrdersRes[]>(orders ?? []),
            pagination,
        }
    }

    static async orderCreate(data: Order | object, manager?: EntityManager) {
        return manager ? await manager.insert(Order, data) : this.insert(data)
    }

    static async orderUpdate(
        data: Order | object,
        conditions: Order | object,
        manager?: EntityManager
    ) {
        return manager
            ? await manager.update(Order, conditions, data)
            : this.update({ ...conditions }, data)
    }
}
