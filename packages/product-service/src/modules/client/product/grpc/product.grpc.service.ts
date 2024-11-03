import { ProductEntityGrpc } from 'protobuf/gen/ts/base/entity'
import { Service } from 'typedi'
import { Pagination } from '../../../../utils/response'
import { Product } from '../entities/product.entity'
import { GetProductsRes } from './dtos/product.dto'

@Service()
export class ProductGrpcGrpcService {
    GetProducts = async (pagination: Pagination) => {
        const [products, total] = await Product.findAndCount({
            take: pagination.limit,
            skip: pagination.getOffset(),
        })
        pagination.total = total

        return {
            products: GetProductsRes.getData<ProductEntityGrpc[]>(products),
            pagination,
        }
    }

    checkValidProducts = async (data: any) => {}
}
