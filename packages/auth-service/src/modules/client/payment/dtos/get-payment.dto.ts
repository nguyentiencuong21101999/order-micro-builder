import { Expose } from 'class-transformer'
import { IsNotEmpty, IsNumber } from 'class-validator'
import { GetUserWalletReqGrpc } from 'protobuf/gen/ts/payment-service/client/payment/payment'
export class GetUserPaymentReq implements GetUserWalletReqGrpc {
    @Expose()
    @IsNumber()
    @IsNotEmpty()
    userId: number
}
