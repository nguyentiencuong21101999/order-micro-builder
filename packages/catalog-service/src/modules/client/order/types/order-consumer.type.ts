export enum OrderStatusType {
    OrderCreated = 0,
    ProductCheckedSuccess = 1,
    ProductCheckedFailed = 2,
    PaymentCheckedSuccess = 3,
    PaymentCheckedFailed = 4,
    OrderCanceled = 5,
    OrderSucceed = 6,
    ProductCanceledSuccess = 100,
    ProductCanceledFailed = 101,
}

export const ContentByStatusOrderParse = {
    [OrderStatusType.OrderCreated]: 'Đơn hàng đang được xử lí',
    [OrderStatusType.ProductCheckedSuccess]: 'Đơn hàng đã được chuẩn bị',
    [OrderStatusType.ProductCheckedFailed]: 'Đơn đang không hợp lệ',
    [OrderStatusType.PaymentCheckedSuccess]: 'Đơn hàng đã thanh toán',
    [OrderStatusType.PaymentCheckedFailed]: 'Đơn hàng thanh toán thất bại',
    [OrderStatusType.OrderCanceled]: 'Đơn hàng đã huỷ',
    [OrderStatusType.OrderSucceed]: 'Đơn hàng thành công',
}
