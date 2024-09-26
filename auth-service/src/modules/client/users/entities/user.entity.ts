import { Column, Entity, EntityManager, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntities } from '../../../../base/base.entities'
import { createQueryBuilder } from '../../../../database/connection'
import { UserResDTO } from '../dtos/user.dto'
import { UserStatusType } from '../types/user.type'
import { UserRole } from './user-role.entity'

export enum UserDeletedEnum {
    Init = 0,
    Deleted = 1,
}

export enum UserVerifiedEnum {
    Init = 0,
    Verified = 1,
}

@Entity('User')
export class User extends BaseEntities {
    @PrimaryGeneratedColumn({ type: 'int' })
    userId: number

    @Column({ type: 'varchar', length: 256 })
    username: string

    @Column({ type: 'varchar', length: 256 })
    email: string

    @Column({ type: 'varchar' })
    password: string

    @Column({ type: 'varchar' })
    phoneNumber: string

    @Column({ type: 'varchar' })
    fullName: string

    @Column({ type: 'date' })
    dob: Date

    @Column({ name: 'status', type: 'tinyint' })
    status: number

    @Column({ type: 'tinyint' })
    isEmailVerified: number

    @Column({ type: 'tinyint' })
    isPhoneVerified: number

    @Column({ type: 'varchar' })
    affiliate: string

    @Column({ type: 'varchar', nullable: true })
    refAffiliate: string

    static async getUser(condition: object) {
        return await this.findOne({
            where: {
                status: UserStatusType.Init,
                ...condition,
            },
        })
    }

    static async updateUser(
        data: object,
        condition: object,
        manager?: EntityManager
    ) {
        return manager
            ? manager.update(User, condition, User.create(data))
            : await this.update(condition, User.create(data))
    }

    static signUp = async <T>(user: User, manager?: EntityManager) => {
        return (
            manager ? await manager.insert(User, user) : await User.insert(user)
        ) as T
    }

    static getUserDetail = async (userId: unknown) => {
        return createQueryBuilder('master', async (builder) => {
            return UserResDTO.transferUserDTO(
                await builder
                    .select(['u.*', 'ur.*'])
                    .from(User, 'u')
                    .leftJoin(UserRole, 'ur', 'u.userId = ur.userId')
                    .where('u.userId = :userId ', { userId })
                    .getRawOne()
            )
        })
    }
}
