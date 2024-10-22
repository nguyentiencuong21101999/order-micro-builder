import { Router } from 'express'
import { Inject, Service } from 'typedi'

import { AppRoute } from '../../../app'
import { transformAndValidate } from '../../../utils/validator'
import { AuthMiddleware } from '../../auth/auth.middleware'
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
import { UserController } from './user.controller'
import { UserMiddleware } from './user.middleware'

@Service()
export class UserRouter implements AppRoute {
    router: Router = Router()
    constructor(
        @Inject() private userMiddleware: UserMiddleware,
        @Inject() private userController: UserController,
        @Inject() private authMiddleware: AuthMiddleware
    ) {
        this.initRouter()
    }

    private initRouter() {
        this.router.post(
            '/sign-up',
            transformAndValidate<UserSignupReqDTO>(UserSignupReqDTO),
            this.userController.signup.bind(this.userController)
        )

        this.router.post(
            '/sign-in',
            transformAndValidate<UserSignInReqDTO>(UserSignInReqDTO),
            this.userController.signIn.bind(this.userController)
        )

        this.router.post(
            '/sign-out',
            this.authMiddleware.authorization.bind(this.authMiddleware),
            this.userController.signOut.bind(this.userController)
        )

        this.router.get(
            '/profile',
            this.authMiddleware.authorization.bind(this.authMiddleware),
            this.userController.getUserProfile.bind(this.userController)
        )

        this.router.put(
            '/profile',
            this.authMiddleware.authorization.bind(this.authMiddleware),
            transformAndValidate(UserUpdateReqDTO),
            this.userController.updateUserProfile.bind(this.userController)
        )

        this.router.put(
            '/password/forgot/:email',
            transformAndValidate<UserForgotPasswordReqDTO>(
                UserForgotPasswordReqDTO
            ),
            this.userController.forgotPassword.bind(this.userController)
        )

        this.router.put(
            '/password',
            this.authMiddleware.authorization.bind(this.authMiddleware),
            transformAndValidate<UserChangePasswordReqDTO>(
                UserChangePasswordReqDTO
            ),
            this.userController.changePassword.bind(this.userController)
        )

        this.router.get(
            '/address',
            this.authMiddleware.authorization.bind(this.authMiddleware),
            this.userController.getUserAddress.bind(this.userController)
        )

        this.router.post(
            '/address',
            this.authMiddleware.authorization.bind(this.authMiddleware),
            transformAndValidate(CreateUserAddressReqDTO),
            this.userController.createUserAddress.bind(this.userController)
        )

        this.router.put(
            '/address/:userAddressId',
            this.authMiddleware.authorization.bind(this.authMiddleware),
            transformAndValidate(UpdateUserAddressReqDTO),
            this.userController.updateUserAddress.bind(this.userController)
        )

        this.router.put(
            '/address/:userAddressId/default',
            this.authMiddleware.authorization.bind(this.authMiddleware),
            transformAndValidate(UpdateDefaultUserAddressReqDTO),
            this.userController.updateDefaultUserAddress.bind(
                this.userController
            )
        )

        this.router.delete(
            '/address/:userAddressId',
            this.authMiddleware.authorization.bind(this.authMiddleware),
            transformAndValidate(DeleteUserAddressReqDTO),
            this.userController.deleteUserAddress.bind(this.userController)
        )
    }
}
