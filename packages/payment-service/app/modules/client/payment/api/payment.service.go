package payment_api

import payment_dto_client "payment-service/app/modules/client/payment/api/dtos"

type IPaymentServiceApi interface {
	GetUserWallet(data payment_dto_client.UserCreateReqDTO) (any, error)
}

type PaymentServiceApi struct {
}

func NewPaymentService() IPaymentServiceApi {
	return &PaymentServiceApi{}
}

func (p *PaymentServiceApi) GetUserWallet(data payment_dto_client.UserCreateReqDTO) (any, error) {
	return nil, nil
}
