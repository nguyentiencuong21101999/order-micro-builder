import { Expose } from 'class-transformer'

export class BaseResponse {
    @Expose()
    createdBy: number

    @Expose()
    createdDate: Date

    @Expose()
    updatedBy: number

    @Expose()
    updatedDate: Date
}
