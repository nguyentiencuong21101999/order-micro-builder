import { NextFunction, Response } from 'express'
import { Inject, Service } from 'typedi'

import { DataRequest } from '../../../base/base.request'
import { ResponseWrapper } from '../../../utils/response'
import { AuthMiddleware, AuthRequest } from '../../auth/auth.middleware'
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
import { UserService } from './user.service'

@Service()
export class UserController {
    constructor(
        @Inject() private UserService: UserService,
        @Inject() public authMiddleware: AuthMiddleware
    ) {
        //
    }

    async signup(
        req: DataRequest<UserSignupReqDTO>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = await this.UserService.signup(req.body)
            res.send(new ResponseWrapper(user, null, null))
        } catch (err) {
            next(err)
        }
    }

    async getUserProfile(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const user = await this.UserService.getUserProfile(
                Number(req.userId)
            )
            res.send(new ResponseWrapper(user, null, null))
        } catch (err) {
            next(err)
        }
    }

    async updateUserProfile(
        req: DataRequest<UserUpdateReqDTO>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = await this.UserService.updateUserProfile(
                req.data,
                Number(req.userId)
            )
            res.send(new ResponseWrapper(user, null, null))
        } catch (err) {
            next(err)
        }
    }

    async signIn(
        req: DataRequest<UserSignInReqDTO>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = await this.UserService.signIn(req.data)
            res.send(new ResponseWrapper(user, null, null))
        } catch (err) {
            next(err)
        }
    }

    async signOut(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const token = this.authMiddleware.getAuthHeader(req)
            await this.UserService.signOut(req.userId, token)
            res.send(new ResponseWrapper(true, null, null))
        } catch (err) {
            next(err)
        }
    }

    async forgotPassword(
        req: DataRequest<UserForgotPasswordReqDTO>,
        res: Response,
        next: NextFunction
    ) {
        try {
            await this.UserService.forgotPassword(req.data)
            res.send(new ResponseWrapper(true, null, null))
        } catch (err) {
            next(err)
        }
    }

    async changePassword(
        req: DataRequest<UserChangePasswordReqDTO>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const token = await this.UserService.changePassword({
                ...req.data,
                roleId: Number(req.roleId),
                userId: Number(req.userId),
            })
            res.send(new ResponseWrapper(token, null, null))
        } catch (err) {
            next(err)
        }
    }

    async getUserAddress(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userAddress = await this.UserService.getUserAddress(
                Number(req.userId)
            )
            res.send(new ResponseWrapper(userAddress, null, null))
        } catch (err) {
            next(err)
        }
    }

    async createUserAddress(
        req: DataRequest<CreateUserAddressReqDTO>,
        res: Response,
        next: NextFunction
    ) {
        try {
            await this.UserService.createUserAddress({
                ...req.data,
                userId: Number(req.userId),
            })
            res.send(new ResponseWrapper(true, null, null))
        } catch (err) {
            next(err)
        }
    }

    async updateDefaultUserAddress(
        req: DataRequest<UpdateDefaultUserAddressReqDTO>,
        res: Response,
        next: NextFunction
    ) {
        try {
            await this.UserService.updateDefaultUserAddress({
                ...req.data,
                userId: Number(req.userId),
            })
            res.send(new ResponseWrapper(true, null, null))
        } catch (err) {
            next(err)
        }
    }

    async updateUserAddress(
        req: DataRequest<UpdateUserAddressReqDTO>,
        res: Response,
        next: NextFunction
    ) {
        try {
            await this.UserService.updateUserAddress({
                ...req.data,
                userId: Number(req.userId),
            })
            res.send(new ResponseWrapper(true, null, null))
        } catch (err) {
            next(err)
        }
    }

    async deleteUserAddress(
        req: DataRequest<DeleteUserAddressReqDTO>,
        res: Response,
        next: NextFunction
    ) {
        try {
            await this.UserService.deleteUserAddress({
                ...req.data,
                userId: Number(req.userId),
            })
            res.send(new ResponseWrapper(true, null, null))
        } catch (err) {
            next(err)
        }
    }
}
