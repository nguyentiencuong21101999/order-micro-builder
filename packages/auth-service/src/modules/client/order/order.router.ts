import { Router } from 'express'
import { Inject, Service } from 'typedi'
import { AppRoute } from '../../../app'
import { transformAndValidate } from '../../../utils/validator'
import { AuthMiddleware } from '../../auth/auth.middleware'
import { OrderCreateReq } from '../dtos/create.dto'
import { GetOrdersReq } from '../dtos/order.dto'
import { OrderController } from './order.controller'
import { OrderMiddleware } from './order.middleware'

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
            this.authMiddleware.authorization,
            transformAndValidate(OrderCreateReq),
            OrderMiddleware.create,
            this.orderController.create.bind(this.orderController)
        )

        this.router.get(
            '/list',
            this.authMiddleware.authorization,
            transformAndValidate(GetOrdersReq),
            this.orderController.getOrders.bind(this.orderController)
        )
    }
}
