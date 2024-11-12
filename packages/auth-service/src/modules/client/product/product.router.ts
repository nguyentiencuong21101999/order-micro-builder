import { Router } from 'express'
import { Inject, Service } from 'typedi'
import { AppRoute } from '../../../app'
import { transformAndValidate } from '../../../utils/validator'
import { AuthMiddleware } from '../../auth/auth.middleware'
import { GetProductsRequestDTO } from './dtos/product.dto'
import { ProductController } from './product.controller'

@Service()
export class ProductRouter implements AppRoute {
    router: Router = Router()
    constructor(
        @Inject() private productController: ProductController,
        @Inject() private authMiddleware: AuthMiddleware
    ) {
        this.initRouter()
    }

    private initRouter() {
        this.router.get(
            '/',
            this.authMiddleware.authorization,
            transformAndValidate(GetProductsRequestDTO),
            this.productController.getProducts.bind(this.productController)
        )
    }
}
