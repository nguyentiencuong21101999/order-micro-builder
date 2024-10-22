import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntities } from '../../../../base/base.entities'

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
}
