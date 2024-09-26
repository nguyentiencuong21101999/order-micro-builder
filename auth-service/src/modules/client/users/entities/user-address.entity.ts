import { Column, Entity, EntityManager, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntities } from '../../../../base/base.entities'
import { UserAddressType } from '../types/user-address.type'

@Entity('UserAddress')
export class UserAddress extends BaseEntities {
    @PrimaryGeneratedColumn({ type: 'int' })
    userAddressId: number

    @Column({ type: 'int' })
    userId: number

    @Column({ type: 'varchar' })
    phoneNumber: string

    @Column({ type: 'varchar' })
    fullName: string

    @Column({ type: 'varchar' })
    ward: string

    @Column({ type: 'varchar' })
    wardCode: string

    @Column({ type: 'varchar' })
    district: string

    @Column({ type: 'varchar' })
    districtCode: string

    @Column({ type: 'varchar' })
    city: string

    @Column({ type: 'varchar' })
    cityCode: string

    @Column({ type: 'varchar' })
    address: string

    @Column({ type: 'smallint', default: 1 })
    type: number

    @Column({ type: 'tinyint' })
    isDefault: number

    static async getUserAddress(userId: number) {
        return this.find({
            where: {
                userId,
            },
            order: {
                isDefault: 'DESC',
                createdDate: 'DESC',
            },
        })
    }

    static async getDefaultUserAddress(userId: number) {
        return await this.findOne({
            where: {
                userId,
                type: UserAddressType.Default,
            },
        })
    }

    static async getDetailUserAddress(userAddressId: number, userId: number) {
        return await this.findOne({
            where: {
                userId,
                userAddressId,
            },
        })
    }

    static async updateUserAddress(
        data: object,
        condition: object,
        manager?: EntityManager
    ) {
        return manager
            ? manager.update(UserAddress, condition, data)
            : await this.update(condition, data)
    }
}
