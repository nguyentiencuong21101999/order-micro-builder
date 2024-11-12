package main

import (
	"log"
	"net"
	"payment-service/app"
	"payment-service/app/config"
	payment_grpc "payment-service/app/modules/client/payment/grpc"

	"go.uber.org/zap"
	"google.golang.org/grpc"

	paymentPb "protobuf-service/gen/go/payment-service/client/payment"
)

var (
	conf *config.Config
)

// type server struct {
// 	paymentPb.UnimplementedGrpcPaymentServer
// }

// func (s *server) GetUserWallet(ctx context.Context, req *paymentPb.GetUserWalletReqGrpc) (*paymentPb.GetUserWalletResGrpc, error) {
// 	// userWallet :=
// 	fmt.Println("aaaaa")

// 	// 	UserId:  12313,
// 	// 	Balance: 123,
// 	// }\
// 	err := errors.New("aaaa")
// 	return nil, errorRes.HandleGrpcError(err)
// }

func main() {

	// load config
	conf = config.GetConfig()

	logger, err := zap.NewDevelopment()
	if err != nil {
		log.Fatalf("failed to create zap logger: %v", err)
	}
	zap.ReplaceGlobals(logger)
	defer logger.Sync()

	container := app.BuildContainer(conf)
	err = container.Invoke(func(paymentSvr *payment_grpc.PaymentServerGrpc) error {
		listen, err := net.Listen("tcp", "0.0.0.0:1008")
		logger.Info("Listen at: ", zap.Any("port", "0.0.0.0:1008"))
		if err != nil {
			logger.Error("failed to listen: ", zap.Error(err))
			return err
		}
		grpcServer := grpc.NewServer()

		paymentPb.RegisterGrpcPaymentServer(grpcServer, paymentSvr)

		if err := grpcServer.Serve(listen); err != nil {
			logger.Fatal("gRPC server failed", zap.Error(err))
			return err
		}

		return nil
	})

	if err != nil {
		log.Fatalf("cannot start server: %v", err)
	}

	// gin.SetMode(gin.ReleaseMode)
	// r := gin.New()

	// container := app.BuildContainer(conf)
	// err = container.Invoke(func(server *modules.Server) {
	// 	server.Routes(r)
	// })

	// if err != nil {
	// 	logger.Fatal("failed to invoke routes", zap.Error(err))
	// }

	// fmt.Println("Server starting on port:", conf.Port)
	// if err := r.Run(fmt.Sprintf(":%d", conf.Port)); err != nil {
	// 	logger.Fatal("router.Run", zap.Error(err))
	// }
}
