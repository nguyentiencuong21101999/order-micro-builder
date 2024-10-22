import { Inject, Service } from 'typedi'
import { bcryptPassword, comparePassword } from '../../../utils/bcrypt'
import { Errors } from '../../../utils/error'
import { AuthService } from '../../auth/auth.service'
import { startTransaction } from '../../../database/connection'
import { UserRole } from '../../client/users/entities/user-role.entity'
import { User } from '../../client/users/entities/user.entity'
import { UserRoleType } from '../../client/users/types/user-role.type'
import { UserService } from '../../client/users/user.service'
import { CMSChangeUserPasswordReqDTO } from './dtos/user-change-password.dto'
import { CMSUserSignInReqDTO } from './dtos/user-sign-in.dto'
import { CMSUserUpdateReqDTO } from './dtos/user-update.dto'
import { CMSGetUserDetailReqDTO, CMSGetUsersReqDTO } from './dtos/user.dto'
import { CMSUser } from './repos/user.repo'

@Service()
export class CMSUserService {
    constructor(
        @Inject() private authService: AuthService,
        @Inject() private userService: UserService
    ) {}

    signIn = async (data: CMSUserSignInReqDTO) => {
        const { username, password } = data

        const user = await User.getUser({ username })
        if (!user) throw Errors.AccountInvalid

        const isValidPassword = comparePassword(password, user.password)
        if (!isValidPassword) throw Errors.AccountInvalid

        const userRole = await UserRole.getUserRole({ userId: user.userId })
        if (!(userRole.roleId !== UserRoleType.User)) throw Errors.RoleInvalid

        const accessToken = this.authService.signToken({
            userId: user.userId,
            roleId: userRole.roleId,
        })

        const userDetail = await User.getUserDetail(user.userId)
        userDetail.accessToken = accessToken
        return userDetail
    }

    changeUserPassword = async (
        data: CMSChangeUserPasswordReqDTO,
        adminId: number
    ): Promise<void> => {
        const { userId, password } = data
        const user = await User.getUser({ userId })
        if (!user) throw Errors.UserNotFound

        await this.checkValidRole(userId, UserRoleType.SuperAdmin)

        await User.updateUser(
            {
                password: await bcryptPassword(password),
                updatedBy: adminId,
            },
            {
                userId,
            }
        )
    }

    getUsers = async (data: CMSGetUsersReqDTO, adminId: number) => {
        return await CMSUser.getUsers({
            ...data,
            adminId,
        })
    }

    getUserDetail = async (data: CMSGetUserDetailReqDTO) => {
        const { userId } = data
        const user = await CMSUser.getUserDetail(userId)
        if (!user) throw Errors.UserNotFound
        return user
    }

    updateUserProfile = async (data: CMSUserUpdateReqDTO, adminId: number) => {
        const { userId, roleId } = data
        if (userId === adminId) throw Errors.Forbidden

        await this.userService.checkUserExisted({ userId })

        const adminRole = await UserRole.getUserRole({ userId: adminId })

        // Admin can only update other admins and users,
        // SuperAdmin can update everyone.
        if (adminRole.roleId === UserRoleType.Admin) {
            await this.checkValidRole(userId, UserRoleType.SuperAdmin)
        }

        // Only the SuperAdmin has the update
        if (roleId) {
            if (!(adminRole.roleId === UserRoleType.SuperAdmin))
                throw Errors.RoleInvalid
        }

        await startTransaction(async (manager) => {
            await User.updateUser(
                { ...data, updatedBy: adminId },
                { userId },
                manager
            )

            await UserRole.updateUserRole(
                { ...data, updatedBy: adminId },
                { userId },
                manager
            )
        })
        return await this.getUserDetail({ userId })
    }

    checkValidRole = async (userId: number, roleId: number) => {
        const isInvalid = await this.roleCompare(userId, roleId)
        if (isInvalid) throw Errors.RoleInvalid
    }

    roleCompare = async (userId: number, roleId: number): Promise<boolean> => {
        const userRole = await UserRole.getUserRole({ userId })
        return userRole.roleId === roleId
    }
}
