import { Router } from 'express'
import { Inject, Service } from 'typedi'
import { AppRoute } from '../../app'
import { UserRouter } from './users/user.router'

@Service()
export class ClientRoute implements AppRoute {
    route?: string = ''
    router: Router = Router()
    constructor(@Inject() private userRouter: UserRouter) {
        this.initRoutes()
    }
    private initRoutes() {
        this.router.use('/user', this.userRouter.router)
    }
}
