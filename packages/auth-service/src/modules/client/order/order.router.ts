import { Router } from 'express'
import { Inject, Service } from 'typedi'
import { AppRoute } from '../../../app'
import { transformAndValidate } from '../../../utils/validator'
import { AuthMiddleware } from '../../auth/auth.middleware'
import { OrderCreateReq } from '../dtos/create.dto'
import { OrderController } from './order.controller'

@Service()
export class OrderRouter implements AppRoute {
    router: Router = Router()
    constructor(
        @Inject() private orderController: OrderController,
        @Inject() private authMiddleware: AuthMiddleware
    ) {
        this.initRouter()
    }

    private initRouter() {
        this.router.post(
            '/',
            transformAndValidate(OrderCreateReq),
            this.orderController.create.bind(this.orderController)
        )
    }
}
