package payment_grpc

import (
	"context"
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

	res, err := s.service.GetUserWallet(req)

	return res, errorRes.HandleGrpcError(err)

}
