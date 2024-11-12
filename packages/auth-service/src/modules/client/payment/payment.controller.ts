import { NextFunction, Response } from 'express'
import { Inject, Service } from 'typedi'
import { DataRequest } from '../../../base/base.request'
import { ResponseWrapper } from '../../../utils/response'
import { AuthMiddleware } from '../../auth/auth.middleware'
import { GetUserPaymentReq } from './dtos/get-payment.dto'
import { PaymentService } from './payment.service'

@Service()
export class PaymentController {
    constructor(
        @Inject() private paymentService: PaymentService,
        @Inject() public authMiddleware: AuthMiddleware
    ) {
        //
    }

    async GetUserPayment(
        req: DataRequest<GetUserPaymentReq>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const payment = await this.paymentService.getUserPayment(req.data)
            res.send(new ResponseWrapper(payment))
        } catch (err) {
            next(err)
        }
    }
}
