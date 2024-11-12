import { Inject, Service } from 'typedi'
import { callGrpc } from '../../../base/base.grpc'
import { GrpcService } from '../../grpc-server/grpc-service'
import { GetUserPaymentReq } from './dtos/get-payment.dto'

@Service()
export class PaymentService {
    constructor(@Inject() private grpcService: GrpcService) {}

    getUserPayment = async (data: GetUserPaymentReq) => {
        /*
        Because getProduct is normal function,
        use an arrow function or bind( this.grpcService.product)
        */
        return await callGrpc(
            data,
            this.grpcService.payment.getUserWallet.bind(
                this.grpcService.payment
            )
        )
    }
}
