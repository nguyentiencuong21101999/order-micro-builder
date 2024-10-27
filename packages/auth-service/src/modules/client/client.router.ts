import { Router } from 'express'
import { Inject, Service } from 'typedi'
import { AppRoute } from '../../app'
import { OrderRouter } from './order/order.router'
import { ProductRouter } from './product/product.router'
import { UserRouter } from './users/user.router'

@Service()
export class ClientRoute implements AppRoute {
    route?: string = ''
    router: Router = Router()
    constructor(
        @Inject() private userRouter: UserRouter,
        @Inject() private productRouter: ProductRouter,
        @Inject() private orderRouter: OrderRouter
    ) {
        this.initRoutes()
    }
    private initRoutes() {
        this.router.use('/user', this.userRouter.router)
        this.router.use('/product', this.productRouter.router)
        this.router.use('/order', this.orderRouter.router)
    }
}
