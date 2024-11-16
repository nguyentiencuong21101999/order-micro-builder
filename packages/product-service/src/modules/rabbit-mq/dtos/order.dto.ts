export class ProductData {
    productId: string
    price: number
    quality: number
}
export class OrderTrackingJobData {
    orderId: number
    userId: number
    status: number
    products?: ProductData[]
    error?: any
}
