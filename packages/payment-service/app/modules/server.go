package modules

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	payment_api "payment-service/app/modules/client/payment/api"
)

type Server struct {
	paymentControllerApi payment_api.IPaymentControllerApi
}

func NewServer(paymentControllerApi payment_api.IPaymentControllerApi) *Server {
	return &Server{
		paymentControllerApi: paymentControllerApi,
	}
}

func (s *Server) Routes(r *gin.Engine) {

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*", "http://*", "https://*"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc:  func(origin string) bool { return true },
		AllowMethods:     []string{"GET", "POST", "PUT", "HEAD", "OPTIONS", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
		MaxAge:           12 * time.Hour,
	}))
	r.GET("/test", s.paymentControllerApi.GetUserWallet)
}
