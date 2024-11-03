import { NextFunction, Response } from 'express'
import { Inject, Service } from 'typedi'
import { DataRequest } from '../../../base/base.request'
import { ResponseWrapper } from '../../../utils/response'
import { AuthMiddleware } from '../../auth/auth.middleware'
import { OrderCreateReq } from '../dtos/create.dto'
import { OrderService } from './order.service'

@Service()
export class OrderController {
    constructor(
        @Inject() private orderService: OrderService,
        @Inject() public authMiddleware: AuthMiddleware
    ) {
        //
    }

    async create(
        req: DataRequest<OrderCreateReq>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { data, pagination } = await this.orderService.create(
                req.data
            )
            res.send(new ResponseWrapper(data, null, pagination))
        } catch (err) {
            next(err)
        }
    }

    async getOrders(
        req: DataRequest<OrderCreateReq>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { data, pagination } = await this.orderService.getOrders(
                req.data
            )
            res.send(new ResponseWrapper(data, null, pagination))
        } catch (err) {
            next(err)
        }
    }
}
