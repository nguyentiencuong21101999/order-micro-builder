export class OrderCreateConsumerData {
    orderId: string
    userId: number
    status: number
    products: {
        productId: string
        price: number
        quality: number
    }[]
}
