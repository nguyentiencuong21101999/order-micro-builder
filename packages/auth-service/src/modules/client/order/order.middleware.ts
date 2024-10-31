import { validateOrReject } from 'class-validator'
import { NextFunction, Response } from 'express'
import { DataRequest } from '../../../base/base.request'
import { parseValidationError } from '../../../utils/validator'
import { OrderCreateReq, OrderProductCreateReq } from '../dtos/create.dto'

export class OrderMiddleware {
    static create = async (
        req: DataRequest<OrderCreateReq>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { products } = req.data
            req.data.userId = req.userId
            for (const product of products) {
                const data =
                    OrderProductCreateReq.toOrderProductCreateReq(product)
                await validateOrReject(data)
            }
            next()
        } catch (error) {
            next(parseValidationError(error))
        }
    }
}
