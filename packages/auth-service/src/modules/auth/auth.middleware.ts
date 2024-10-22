import { NextFunction, Request, Response } from 'express'
import { Inject, Service } from 'typedi'
import { Errors } from '../../utils/error'
import { UserRoleType } from '../client/users/types/user-role.type'
import { AuthService } from './auth.service'
export interface AuthRequest extends Request {
    userId: number
    roleId: number
}

@Service()
export class AuthMiddleware {
    constructor(@Inject() private authService: AuthService) {}

    authorization = async (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const token = this.getAuthHeader(req)
            if (!token) throw Errors.Unauthorized
            const payload = await this.authService.verifyToken(token)
            req.userId = payload.userId
            req.roleId = payload.roleId
            next()
        } catch (err) {
            next(Errors.Unauthorized)
        }
    }

    checkAdminRole = async (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (Number(req.roleId) == UserRoleType.User) {
                throw Errors.RoleInvalid
            }
            next()
        } catch (error) {
            next(Errors.RoleInvalid)
        }
    }

    getAuthHeader = (req: Request) => {
        const authHeader = req.headers['authorization']
        const [, token] = authHeader && authHeader.split(' ')
        return token
    }
}
