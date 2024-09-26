import { Column, Entity, EntityManager, PrimaryColumn } from 'typeorm'
import { BaseEntities } from '../../../../base/base.entities'

@Entity('UserRole')
export class UserRole extends BaseEntities {
    @PrimaryColumn({ type: 'int' })
    userId: number

    @PrimaryColumn({ type: 'smallint' })
    roleId: number

    @Column({ type: 'varchar' })
    roleName: string

    static async getUserRole(condition: object) {
        return this.findOne({ where: condition })
    }

    static async updateUserRole(
        data: object,
        condition: object,
        manager?: EntityManager
    ) {
        return manager
            ? manager.update(UserRole, condition, UserRole.create(data))
            : await this.update(condition, UserRole.create(data))
    }
}
