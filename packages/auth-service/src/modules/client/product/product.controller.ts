import { NextFunction, Response } from 'express'
import { Inject, Service } from 'typedi'
import { DataRequest } from '../../../base/base.request'
import { ResponseWrapper } from '../../../utils/response'
import { AuthMiddleware } from '../../auth/auth.middleware'
import { GetProductsRequestDTO } from './dtos/product.dto'
import { ProductService } from './product.service'

@Service()
export class ProductController {
    constructor(
        @Inject() private productService: ProductService,
        @Inject() public authMiddleware: AuthMiddleware
    ) {
        //
    }

    async getProducts(
        req: DataRequest<GetProductsRequestDTO>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { data, pagination } = await this.productService.getProducts(
                req.data
            )
            res.send(new ResponseWrapper(data, null, pagination))
        } catch (err) {
            console.log(err.toString())
            next(err)
        }
    }
}
