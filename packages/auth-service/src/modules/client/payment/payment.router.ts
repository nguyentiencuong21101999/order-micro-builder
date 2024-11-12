import { Router } from 'express'
import { Inject, Service } from 'typedi'
import { AppRoute } from '../../../app'
import { transformAndValidate } from '../../../utils/validator'
import { AuthMiddleware } from '../../auth/auth.middleware'
import { GetUserPaymentReq } from './dtos/get-payment.dto'
import { PaymentController } from './payment.controller'

@Service()
export class PaymentRouter implements AppRoute {
    router: Router = Router()
    constructor(
        @Inject() private paymentController: PaymentController,
        @Inject() private authMiddleware: AuthMiddleware
    ) {
        this.initRouter()
    }

    private initRouter() {
        this.router.get(
            '/',
            this.authMiddleware.authorization,
            transformAndValidate(GetUserPaymentReq),
            this.paymentController.GetUserPayment.bind(this.paymentController)
        )
    }
}
