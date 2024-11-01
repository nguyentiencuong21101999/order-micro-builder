import { Column, Entity, EntityManager, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntities } from '../../../../base/base.entities'
import { LockMode } from '../../../../database/types/lock-mode.type'

@Entity('Product')
export class Product extends BaseEntities {
    @PrimaryGeneratedColumn({ type: 'int' })
    productId: number

    @Column({ type: 'varchar' })
    name: string

    @Column({ type: 'varchar' })
    imageUrl: string

    @Column({ type: 'double', precision: 10, scale: 2, default: 0 })
    price: number

    @Column({ type: 'int', default: 0 })
    quality: number

    static async gets(conditions: Product | object, manager?: EntityManager) {
        return manager
            ? manager.find(Product, {
                  where: { ...conditions },
                  lock: {
                      mode: LockMode.FOR_UPDATE,
                  },
              })
            : await this.find({
                  where: { ...conditions },
              })
    }
}
