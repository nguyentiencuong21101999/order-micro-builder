import { Expose, Transform } from 'class-transformer'
import { OrderReqGrpc } from 'protobuf/gen/ts/order-service/client/order/order'
import { OrderSharedDTO } from 'protobuf/shared/dtos/order.dto'
import { ProductSharedDTO } from 'protobuf/shared/dtos/product.dto'

export class GetOrdersRes extends OrderSharedDTO implements OrderReqGrpc {
    @Expose()
    @Transform((params) => {
        try {
            const { obj } = params
            return OrderSharedDTO.getData<OrderSharedDTO[]>(obj)
        } catch (_) {
            return
        }
    })
    order: OrderSharedDTO

    @Expose()
    @Transform((params) => {
        try {
            const products = params.obj.products as ProductSharedDTO[]

            const productsRes = []
            products.forEach((product) => {
                productsRes.push(
                    ProductSharedDTO.getData<OrderSharedDTO[]>(product)
                )
            })
            return productsRes.filter((p) => !!p)
        } catch (_) {
            return []
        }
    })
    products: ProductSharedDTO[]

    static getData = <T>(data: any) => {
        return (this.baseData(data, this) || []) as T
    }
}
