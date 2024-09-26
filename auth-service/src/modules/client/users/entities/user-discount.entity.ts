import { Column, Entity, PrimaryColumn } from 'typeorm'
import { BaseEntities } from '../../../../base/base.entities'

@Entity('UserDiscount')
export class UserDiscount extends BaseEntities {
    @PrimaryColumn({ type: 'int' })
    userId: number

    @Column({ type: 'double', precision: 10, scale: 2, default: 0 })
    discount: number
}
