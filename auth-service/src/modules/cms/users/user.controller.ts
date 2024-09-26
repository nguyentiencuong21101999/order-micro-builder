import { NextFunction, Response } from 'express'
import { Inject, Service } from 'typedi'
import { DataRequest } from '../../../base/base.request'
import { Pagination, ResponseWrapper } from '../../../utils/response'
import { CMSChangeUserPasswordReqDTO } from './dtos/user-change-password.dto'
import { CMSUserSignInReqDTO } from './dtos/user-sign-in.dto'
import { CMSUserUpdateReqDTO } from './dtos/user-update.dto'
import { CMSGetUserDetailReqDTO, CMSGetUsersReqDTO } from './dtos/user.dto'
import { CMSUserService } from './user.service'

@Service()
export class CMSUserController {
    constructor(@Inject() private cmsUserService: CMSUserService) {}
    async signIn(
        req: DataRequest<CMSUserSignInReqDTO>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = await this.cmsUserService.signIn(req.data)
            res.send(new ResponseWrapper(user, null, null))
        } catch (err) {
            next(err)
        }
    }

    async changeUserPassword(
        req: DataRequest<CMSChangeUserPasswordReqDTO>,
        res: Response,
        next: NextFunction
    ) {
        try {
            await this.cmsUserService.changeUserPassword(req.data, req.userId)
            res.send(new ResponseWrapper(true, null, null))
        } catch (err) {
            next(err)
        }
    }

    async getUsers(
        req: DataRequest<CMSGetUsersReqDTO>,
        res: Response,
        next: NextFunction
    ) {
        try {
            req.data.pagination = Pagination.fromReq(req)
            const { users, pagination } = await this.cmsUserService.getUsers(
                req.data,
                req.userId
            )
            res.send(new ResponseWrapper(users, null, pagination))
        } catch (err) {
            next(err)
        }
    }

    async getUserDetail(
        req: DataRequest<CMSGetUserDetailReqDTO>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = await this.cmsUserService.getUserDetail(req.data)
            res.send(new ResponseWrapper(user, null))
        } catch (err) {
            next(err)
        }
    }

    async updateUserProfile(
        req: DataRequest<CMSUserUpdateReqDTO>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = await this.cmsUserService.updateUserProfile(
                req.data,
                req.userId
            )
            res.send(new ResponseWrapper(user, null))
        } catch (err) {
            next(err)
        }
    }
}
