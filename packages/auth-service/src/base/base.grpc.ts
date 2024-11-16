import { plainToInstance } from 'class-transformer'
import { ClientUnaryCall } from 'protobuf/node_modules/@grpc/grpc-js'
import { UnaryCallback } from 'protobuf/node_modules/@grpc/grpc-js/build/src/client'
import { ErrorResp } from '../utils/error'
import { ResponseWrapper } from '../utils/response'

export function callGrpc<Req, Res>(
    payloadReq: Req,
    grpcMethod: (req: Req, callback: UnaryCallback<any>) => ClientUnaryCall
) {
    return new Promise<ResponseWrapper>((resolve, reject) => {
        grpcMethod(payloadReq, (err, result) => {
            if (err) {
                const errRes = JSON.parse(err?.details)
                reject(
                    plainToInstance(ErrorResp, errRes, {
                        excludeExtraneousValues: true,
                    })
                )
            }

            resolve(result)
        })
    })
}
