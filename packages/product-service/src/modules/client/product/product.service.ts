import { ProductGrpc } from 'protobuf/gen/ts/product-service/client/product/product'
import { Service } from 'typedi'
import { Pagination } from '../../../utils/response'
import { ProductDTO } from './dtos/product.dto'
import { Product } from './entities/product.entity'

@Service()
export class ProductService {
    GetProducts = async (pagination: Pagination) => {
        const [products, total] = await Product.findAndCount({
            take: pagination.limit,
            skip: pagination.getOffset(),
        })
        pagination.total = total
        return {
            products: await ProductDTO.getData<ProductGrpc[]>(products),
            pagination,
        }
    }
}
