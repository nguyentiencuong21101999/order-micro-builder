package payment_grpc

import (
	payment_entity "payment-service/app/modules/client/payment/entities"
	paymentPb "protobuf-service/gen/go/payment-service/client/payment"
)

type IPaymentServiceGrpc interface {
	GetUserWallet(req *paymentPb.GetUserWalletReqGrpc) (*paymentPb.GetUserWalletResGrpc, error)
}

type PaymentServiceGrpc struct {
	paymentEntity payment_entity.IPaymentEntity
}

func NewPaymentServiceGrpc(paymentEntity payment_entity.IPaymentEntity) IPaymentServiceGrpc {
	return &PaymentServiceGrpc{
		paymentEntity: paymentEntity,
	}
}

func (s *PaymentServiceGrpc) GetUserWallet(req *paymentPb.GetUserWalletReqGrpc) (*paymentPb.GetUserWalletResGrpc, error) {
	return s.paymentEntity.GetByUserId(req.UserId, nil)
}
