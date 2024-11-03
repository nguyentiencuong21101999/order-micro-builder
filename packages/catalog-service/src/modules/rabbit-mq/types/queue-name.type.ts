export enum RabbitQueueNames {
    /* order */
    OrderCreated = 'order-created',
    OrderUpdate = 'order-update',
    OrderUpdated = 'order-updated',

    /* product */
    ProductCheck = 'product-check',
    ProductChecked = 'product-checked',
    ProductCancel = 'product-cancel',
    ProductCanceled = 'product-canceled',

    /* payment */
    PaymentCheck = 'payment-check',
    PaymentChecked = 'payment-checked',
}
