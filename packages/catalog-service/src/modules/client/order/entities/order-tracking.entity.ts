import { Column, Entity, EntityManager, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntities } from '../../../../base/base.entities'

@Entity('OrderTracking')
export class OrderTracking extends BaseEntities {
    @PrimaryGeneratedColumn({ type: 'int' })
    orderTrackingId: number

    @Column({ type: 'varchar' })
    orderId: string

    @Column({ type: 'int' })
    userId: number

    @Column({ type: 'smallint' })
    status: number

    @Column({ type: 'varchar' })
    content: string

    @Column({ type: 'text' })
    errorCode: string

    @Column({ type: 'text' })
    errorMessage: string

    static async orderTrackingCreate(
        data: OrderTracking | object,
        manager?: EntityManager
    ) {
        return manager
            ? manager.insert(OrderTracking, data)
            : await this.insert(data)
    }
}
