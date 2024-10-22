import { Router } from 'express'
import { Inject, Service } from 'typedi'

import { CMSChangeUserPasswordReqDTO } from './dtos/user-change-password.dto'
import { CMSUserSignInReqDTO } from './dtos/user-sign-in.dto'
import { CMSUserUpdateReqDTO } from './dtos/user-update.dto'
import { CMSGetUserDetailReqDTO, CMSGetUsersReqDTO } from './dtos/user.dto'
import { CMSUserController } from './user.controller'
import { AppRoute } from '../../../app'
import { AuthMiddleware } from '../../auth/auth.middleware'
import { transformAndValidate } from '../../../utils/validator'

@Service()
export class CMSUserRoute implements AppRoute {
    router: Router = Router()
    constructor(
        @Inject() private authMiddleware: AuthMiddleware,
        @Inject() private cmsUserController: CMSUserController
    ) {
        this.initRoutes()
    }
    private initRoutes() {
        this.router.post(
            '/sign-in',
            transformAndValidate(CMSUserSignInReqDTO),
            this.cmsUserController.signIn.bind(this.cmsUserController)
        )

        this.router.put(
            '/password/:userId',
            this.authMiddleware.authorization.bind(this.authMiddleware),
            this.authMiddleware.checkAdminRole.bind(this.authMiddleware),
            transformAndValidate(CMSChangeUserPasswordReqDTO),
            this.cmsUserController.changeUserPassword.bind(
                this.cmsUserController
            )
        )

        this.router.get(
            '',
            this.authMiddleware.authorization.bind(this.authMiddleware),
            this.authMiddleware.checkAdminRole.bind(this.authMiddleware),
            transformAndValidate(CMSGetUsersReqDTO),
            this.cmsUserController.getUsers.bind(this.cmsUserController)
        )

        this.router.get(
            '/:userId',
            this.authMiddleware.authorization.bind(this.authMiddleware),
            this.authMiddleware.checkAdminRole.bind(this.authMiddleware),
            transformAndValidate(CMSGetUserDetailReqDTO),
            this.cmsUserController.getUserDetail.bind(this.cmsUserController)
        )

        this.router.put(
            '/:userId',
            this.authMiddleware.authorization.bind(this.authMiddleware),
            this.authMiddleware.checkAdminRole.bind(this.authMiddleware),
            transformAndValidate(CMSUserUpdateReqDTO),
            this.cmsUserController.updateUserProfile.bind(
                this.cmsUserController
            )
        )
    }
}
