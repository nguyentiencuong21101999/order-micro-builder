import { Column, Entity, EntityManager, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntities } from '../../../../base/base.entities'
import { IsExpiredOtpType } from '../types/user-otp-history.type'

@Entity({ name: 'UserOtpHistory' })
export class UserOtpHistory extends BaseEntities {
    @PrimaryGeneratedColumn({ name: 'userOtpHistoryId', type: 'int' })
    userOtpHistoryId: number

    @Column({ name: 'userId', type: 'int' })
    userId: number

    @Column({ name: 'sendVia', type: 'tinyint' })
    sendVia: number

    @Column({ name: 'sendTo', type: 'varchar' })
    sendTo: string

    @Column({ name: 'key', type: 'varchar', nullable: true })
    key: string

    @Column({ name: 'code', type: 'varchar' })
    code: string

    @Column({ name: 'expiredAt', type: 'datetime' })
    expiredAt: Date

    @Column({
        name: 'isExpired',
        type: 'tinyint',
        default: IsExpiredOtpType.Init,
    })
    isExpired: number

    @Column({ name: 'type', type: 'tinyint' })
    type: number

    @Column({ name: 'date', type: 'varchar' })
    date: string

    static async getTotalMailInDay(conditions: unknown) {
        return await this.count({
            where: conditions,
        })
    }

    static async userOtpHistoryInsert(data: unknown, manager?: EntityManager) {
        return manager
            ? await manager.insert(UserOtpHistory, data)
            : await this.insert(data)
    }

    static async userOtpHistoryUpdate(
        data: unknown,
        conditions: unknown,
        manager?: EntityManager
    ) {
        return manager
            ? await manager.update(UserOtpHistory, conditions, data)
            : await this.update(conditions, data)
    }
}
