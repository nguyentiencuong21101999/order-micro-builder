export class OrderTrackingJobData {
    orderId: number
    userId: number
    status: number
    products?: {
        productId: string
        price: number
        quality: number
    }[]
    error?: any
}
