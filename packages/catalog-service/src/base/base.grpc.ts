import { ClassConstructor, Expose, Transform } from 'class-transformer'
import {
    sendUnaryData,
    ServerUnaryCall,
} from 'protobuf/node_modules/@grpc/grpc-js'
import { toDateTimeBaseResponse } from '../utils/class-transform'
import { transformAndValidateResGrpc } from '../utils/validator'

export type grpcRes<Res> = sendUnaryData<Res>
export type grpcReq<Req> = ServerUnaryCall<Req, any>

export class BaseResponseGrpc {
    @Expose()
    createdBy: number

    @Expose()
    @Transform(toDateTimeBaseResponse)
    createdDate: string

    @Expose()
    updatedBy: number

    @Expose()
    @Transform(toDateTimeBaseResponse)
    updatedDate: string

    static baseData = async <T>(data: any, cls: ClassConstructor<T>) => {
        return await transformAndValidateResGrpc(cls, data)
    }
}
