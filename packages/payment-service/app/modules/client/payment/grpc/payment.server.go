package payment_grpc

import (
	"context"
	"errors"
	"fmt"
	errorRes "payment-service/app/helpers/errors"

	paymentPb "protobuf-service/gen/go/payment-service/client/payment"
)

type PaymentServerGrpc struct {
	paymentPb.UnimplementedGrpcPaymentServer
	service IPaymentServiceGrpc
}

func NewPaymentServerGrpc(service IPaymentServiceGrpc) *PaymentServerGrpc {
	return &PaymentServerGrpc{
		service: service,
	}
}

func (s *PaymentServerGrpc) GetUserWallet(_ context.Context, req *paymentPb.GetUserWalletReqGrpc) (*paymentPb.GetUserWalletResGrpc, error) {
	// userWallet :=
	fmt.Println("bb")

	// 	UserId:  12313,
	// 	Balance: 123,
	// }\
	err := errors.New("bb")
	s.service.GetUserWallet(req)
	return nil, errorRes.HandleGrpcError(err)
}
