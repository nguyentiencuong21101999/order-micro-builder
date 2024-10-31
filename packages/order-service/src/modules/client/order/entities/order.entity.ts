import { Column, Entity, EntityManager, PrimaryColumn } from 'typeorm'
import { BaseEntities } from '../../../../base/base.entities'

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

    static async orderCreate(data: Order | object, manager?: EntityManager) {
        return manager ? await manager.insert(Order, data) : this.insert(data)
    }
}
