import { Router } from 'express'
import { Inject, Service } from 'typedi'
import { AppRoute } from '../../app'
import { CMSUserRoute } from './users/user.router'

@Service()
export class CMSRoute implements AppRoute {
    route?: string = 'cms'
    router: Router = Router()
    constructor(@Inject() private cmsUserRouter: CMSUserRoute) {
        this.initRoutes()
    }

    private initRoutes() {
        this.router.use('/user', this.cmsUserRouter.router)
    }
}
