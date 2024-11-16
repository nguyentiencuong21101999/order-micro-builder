package payment_consumer

import errorRes "payment-service/app/helpers/errors"

type ProductDataMsg struct {
	ProductId string  `json:"productId"`
	Name      string  `json:"name"`
	ImageUrl  string  `json:"imageUrl"`
	Price     float64 `json:"price"`
	Quality   int     `json:"quality"`
}

type PaymentCheckDataMsg struct {
	OrderId  string              `json:"orderId"`
	UserId   int32               `json:"userId"`
	Status   int                 `json:"status"`
	Products []ProductDataMsg    `json:"products"`
	Error    *errorRes.ErrorResp `json:"error"`
}

var OrderStatusType = map[string]int{
	"OrderCreated":          0,
	"ProductCheckedSuccess": 1,
	"ProductCheckedFailed":  2,
	"PaymentCheckedSuccess": 3,
	"PaymentCheckedFailed":  4,
	"OrderCanceled":         5,
	"OrderSucceed":          6,
}
