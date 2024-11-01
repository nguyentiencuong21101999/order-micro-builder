export enum OrderStatusType {
    orderCreated = 0,
}

export const ContentByStatusOrderParse = {
    [OrderStatusType.orderCreated]: 'Đơn hàng đã được đặt thành công',
}
