import {
    Column,
    Entity,
    EntityManager,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { BaseEntities, DataUpdateType } from '../../../../base/base.entities'

@Entity('OrderProduct')
export class OrderProduct extends BaseEntities {
    @PrimaryGeneratedColumn({ type: 'int' })
    orderProductId: number

    @PrimaryColumn({ type: 'varchar' })
    productId: string

    @PrimaryColumn({ type: 'varchar' })
    orderId: string

    @PrimaryColumn({ type: 'int' })
    userId: number

    @Column({ type: 'varchar' })
    name: string

    @Column({ type: 'varchar' })
    imageUrl: string

    @Column({ type: 'double', precision: 10, scale: 2, default: 0 })
    price: number

    @Column({ type: 'int', default: 0 })
    quality: number

    @Column({ type: 'varchar' })
    note: number

    @Column({ type: 'varchar' })
    attributes: string

    static async orderProductCreate(
        data: DataUpdateType<OrderProduct | object>,
        manager?: EntityManager
    ) {
        return manager
            ? await manager.insert(OrderProduct, data)
            : this.insert(data)
    }
}
