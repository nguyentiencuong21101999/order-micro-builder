package payment_grpc

import (
	"errors"
	"fmt"
	errorRes "payment-service/app/helpers/errors"
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
	// userWallet :=
	fmt.Println("bb")
	s.paymentEntity.GetUserWallet(int(req.UserId))
	// 	UserId:  12313,
	// 	Balance: 123,
	// }\
	err := errors.New("bb")
	return nil, errorRes.HandleGrpcError(err)
}
