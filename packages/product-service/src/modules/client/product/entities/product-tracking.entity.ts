import { Column, Entity, EntityManager, PrimaryColumn } from 'typeorm'
import { BaseEntities } from '../../../../base/base.entities'

@Entity('ProductTracking')
export class ProductTracking extends BaseEntities {
    @PrimaryColumn({ type: 'int' })
    orderId: number

    @PrimaryColumn({ type: 'int' })
    userId: number

    @Column({ type: 'text' })
    jsonData: string

    static async get(conditions: ProductTracking | object) {
        return await this.findOne({
            where: { ...conditions },
        })
    }

    static async productTrackingCreate(
        data: ProductTracking | object,
        manager?: EntityManager
    ) {
        return manager
            ? await manager.insert(ProductTracking, data)
            : await this.insert(data)
    }
}
