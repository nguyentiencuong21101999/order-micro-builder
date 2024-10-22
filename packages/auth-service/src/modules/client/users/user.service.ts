import { Inject, Service } from 'typedi'

import { startTransaction } from '../../../database/connection'
import {
    bcryptPassword,
    comparePassword,
    genPassword,
} from '../../../utils/bcrypt'
import { Errors } from '../../../utils/error'
import { getUTCDate } from '../../../utils/helper'
import { AuthService } from '../../auth/auth.service'
import { MailerService } from '../../mailer/mailer.service'
import {
    MailerSubjectType,
    MailerTemplateNameType,
} from '../../mailer/types/mailer.type'
import {
    CreateUserAddressReqDTO,
    DeleteUserAddressReqDTO,
    UpdateDefaultUserAddressReqDTO,
    UpdateUserAddressReqDTO,
} from './dtos/user-address.dto'
import { UserChangePasswordReqDTO } from './dtos/user-change-password.dto'
import { UserForgotPasswordReqDTO } from './dtos/user-forgot-password.dto'
import { UserSignInReqDTO } from './dtos/user-sign-in.dto'
import { UserSignupReqDTO } from './dtos/user-signup.dto'
import { UserUpdateReqDTO } from './dtos/user-update.dto'
import { UserAddress } from './entities/user-address.entity'
import { UserOtpHistory } from './entities/user-otp-history.entity'
import { UserRole } from './entities/user-role.entity'

import { User } from './entities/user.entity'
import { UserAddressType } from './types/user-address.type'
import { IsExpiredOtpType, SendViaOtpType } from './types/user-otp-history.type'
import { UserRoleType } from './types/user-role.type'

@Service()
export class UserService {
    constructor(
        @Inject() public authService: AuthService,
        @Inject() public mailerService: MailerService
    ) {}

    signup = async (data: UserSignupReqDTO) => {
        await this.verifyUserUnique(data)

        let newUserId: number

        await startTransaction(async (manager) => {
            const insertResult = await manager.insert(
                User,
                await UserSignupReqDTO.toUserEntity(data)
            )

            newUserId = insertResult.raw.insertId

            await manager.insert(UserRole, {
                userId: newUserId,
                roleId: UserRoleType.User,
            })
        })
        const user = await User.getUserDetail(newUserId)
        const token = this.authService.signToken({
            userId: newUserId,
            roleId: user.roleId,
        })
        user.accessToken = token

        return user
    }

    getUserProfile = async (userId: number) => {
        const user = await User.getUserDetail(userId)
        if (!user) {
            throw Errors.UserNotFound
        }
        return user
    }

    updateUserProfile = async (data: UserUpdateReqDTO, userId: number) => {
        await this.verifyUserUnique(data)
        const update = await User.update(
            {
                userId,
            },
            { ...data, updatedBy: userId }
        )
        if (!(update?.affected > 0)) throw Errors.UserNotFound
        return await this.getUserProfile(userId)
    }

    signIn = async (data: UserSignInReqDTO) => {
        const { username, password } = data
        const user = await User.getUser({ username })
        if (!user) throw Errors.AccountInvalid
        const isValidPassword = comparePassword(password, user.password)
        if (!isValidPassword) throw Errors.AccountInvalid

        const userDetail = await User.getUserDetail(user.userId)
        userDetail.accessToken = this.authService.signToken({
            userId: user.userId,
            roleId: userDetail.roleId,
        })
        return userDetail
    }

    signOut = async (userId: number, token: string) => {
        await this.authService.removeAccessToken(userId, token)
    }

    forgotPassword = async (data: UserForgotPasswordReqDTO) => {
        const user = await User.getUser({ email: data.email })
        if (!user) throw Errors.EmailNotFound

        const { email, userId } = user

        await this.checkSendMailLimit(email, SendViaOtpType.Email)
        const pwd = genPassword()

        await startTransaction(async (manager) => {
            await UserOtpHistory.userOtpHistoryUpdate(
                {
                    isExpired: IsExpiredOtpType.Used,
                },
                {
                    sendTo: email,
                    type: SendViaOtpType.Email,
                },
                manager
            )

            await UserOtpHistory.userOtpHistoryInsert(
                {
                    userId,
                    sendVia: SendViaOtpType.Email,
                    sendTo: email,
                    code: await bcryptPassword(pwd),
                    date: getUTCDate(),
                    type: SendViaOtpType.Email,
                },
                manager
            )

            await User.updateUser(
                { password: await bcryptPassword(pwd) },
                {
                    userId,
                },
                manager
            )

            await this.mailerService.sendMailToQueue(
                email,
                MailerSubjectType.ForgotPassword,
                { '#pwd': pwd },
                MailerTemplateNameType.ForgotPassword
            )
        })
    }

    changePassword = async (data: UserChangePasswordReqDTO) => {
        const { userId, roleId, password, currentPassword } = data
        const user = await this.checkUserExisted({ userId })

        const isValidPassword = comparePassword(currentPassword, user.password)
        if (!isValidPassword) throw Errors.CurrentPasswordInvalid

        const update = await User.update(
            {
                userId,
            },
            {
                password: await bcryptPassword(password),
                updatedBy: userId,
            }
        )
        if (!(update?.affected > 0)) throw Errors.ChangePasswordFailed

        await this.authService.removeAllAccessToken(userId)

        return {
            accessToken: this.authService.signToken({
                userId,
                roleId,
            }),
        }
    }

    getUserAddress = async (userId: number) => {
        return await UserAddress.getUserAddress(userId)
    }

    createUserAddress = async (data: CreateUserAddressReqDTO) => {
        const address = await UserAddress.getDefaultUserAddress(data.userId)
        await UserAddress.insert({
            ...data,
            isDefault: address ? UserAddressType.Init : UserAddressType.Default,
        })
    }

    updateDefaultUserAddress = async (data: UpdateDefaultUserAddressReqDTO) => {
        const { userAddressId, userId } = data
        const userAddress = await UserAddress.getDetailUserAddress(
            data.userAddressId,
            data.userId
        )
        if (!userAddress) throw Errors.UserAddressNotFound
        if (userAddress.isDefault) throw Errors.UserAddressIsDefault

        await startTransaction(async (manager) => {
            await UserAddress.updateUserAddress(
                {
                    isDefault: UserAddressType.Init,
                    updatedBy: userId,
                },
                { userId, isDefault: UserAddressType.Default },
                manager
            )

            await UserAddress.updateUserAddress(
                {
                    isDefault: UserAddressType.Default,
                },
                { userAddressId, userId },
                manager
            )
        })
    }

    updateUserAddress = async (data: UpdateUserAddressReqDTO) => {
        const { userId, userAddressId } = data
        const update = await UserAddress.updateUserAddress(
            { ...data, updatedBy: userId },
            {
                userId,
                userAddressId,
            }
        )
        if (!(update?.affected > 0)) throw Errors.UserAddressUpdateFailed
    }

    deleteUserAddress = async (data: DeleteUserAddressReqDTO) => {
        const { userId, userAddressId } = data

        const del = await UserAddress.delete({
            userId,
            userAddressId,
            isDefault: UserAddressType.Init,
        })
        if (!(del?.affected > 0)) throw Errors.UserAddressDeleteFailed
    }

    verifyUserUnique = async (data: any) => {
        if (data.username) {
            const username = await User.getUser({ username: data.username })
            if (username) throw Errors.UsernameExisted
        }
        if (data.email) {
            const email = await User.getUser({ email: data.email })
            if (email) throw Errors.EmailExisted
        }
        if (data.phoneNumber) {
            const phoneNumber = await User.getUser({
                phoneNumber: data.phoneNumber,
            })
            if (phoneNumber) throw Errors.PhoneNumberExisted
        }
    }

    private checkSendMailLimit = async (
        sendTo: string,
        type: number
    ): Promise<void> => {
        const count = await UserOtpHistory.getTotalMailInDay({
            sendTo,
            type,
            date: getUTCDate(),
        })

        if (count >= 5) {
            throw Errors.MaximumSendMail
        }
    }

    checkUserExisted = async (conditions: object): Promise<User> => {
        const user = await User.getUser(conditions)
        if (!user) throw Errors.UserNotFound
        return user
    }
}
