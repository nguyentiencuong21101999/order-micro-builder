import { ProductEntityGrpc } from 'protobuf/gen/ts/base/entity'
import { ProductSharedDTO } from 'protobuf/shared/dtos/product.dto'

export class GetProductsRes
    extends ProductSharedDTO
    implements ProductEntityGrpc
{
    static getData = <T>(data: any) => {
        return (this.baseData(data, this) || []) as T
    }
}
