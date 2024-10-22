import { SelectQueryBuilder } from 'typeorm'
import { BySortType } from '../../../../base/base.entities'
import {
    AppDataSource,
    createQueryBuilder,
} from '../../../../database/connection'
import { UserRole } from '../../../client/users/entities/user-role.entity'
import { User } from '../../../client/users/entities/user.entity'
import {
    CMSGetUsersReqDTO,
    CMSUserDetailResDTO,
    CMSUsersResDTO
} from '../dtos/user.dto'

export const CMSUser = AppDataSource.getRepository(User).extend({
    async getUsers(data: CMSGetUsersReqDTO) {
        const { pagination, status, search, order, by } = data
        const res = await createQueryBuilder('master', async (builder) => {
            const queryBuilder: SelectQueryBuilder<User> = builder
                .select(['u.*', 'ur.roleId as roleId'])
                .from(User, 'u')
                .innerJoin(UserRole, 'ur', 'u.userId = ur.userId')
                .where('u.userId <> :adminId', {
                    adminId: data.adminId,
                })
                .offset(pagination.getOffset())
                .limit(pagination.limit)

            /* filter */
            if (!isNaN(status)) {
                queryBuilder.andWhere('u.status = :status', {
                    status,
                })
            }

            /* sort */
            if (order) {
                queryBuilder.orderBy(order, by ? by : BySortType.ASC)
            } else {
                queryBuilder.orderBy('u.createdDate', 'DESC')
            }

            /* search */
            if (search) {
                queryBuilder.andWhere('username = :search or email = :search', {
                    search,
                })
            }

            return await Promise.all([
                queryBuilder.execute(),
                queryBuilder.getCount(),
            ])
        })

        pagination.total = res?.[1] ?? 0
        return {
            users: CMSUsersResDTO.transferData(res?.[0] ?? []),
            pagination,
        }
    },

    async getUserDetail(userId: number) {
        return await createQueryBuilder('master', async (builder) => {
            const queryBuilder = builder
                .select(['u.*', 'ur.roleId roleId'])
                .from(User, 'u')
                .innerJoin(UserRole, 'ur', 'u.userId = ur.userId')
                .where('u.userId = :userId', {
                    userId,
                })
                .orderBy('u.createdDate', 'DESC')
            return CMSUserDetailResDTO.transferData(
                await queryBuilder.execute()
            )
        })
    },
})
