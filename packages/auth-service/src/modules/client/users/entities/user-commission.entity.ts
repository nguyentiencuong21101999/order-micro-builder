import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntities } from '../../../../base/base.entities'

@Entity('UserCommission')
export class UserCommission extends BaseEntities {
    @PrimaryGeneratedColumn({ type: 'int' })
    userCommissionId: number

    @Column({ type: 'int' })
    userId: number

    @Column({ type: 'double', precision: 10, scale: 2, default: 0 })
    totalCommission: number

    @Column({ type: 'date' })
    date: string

    @Column({ type: 'smallint' })
    status: number
}
