import { IsString } from 'class-validator'

export class GrpcConfig {
    @IsString()
    orderServicePort: string

    @IsString()
    productServicePort: string

    @IsString()
    paymentServicePort: string
}
