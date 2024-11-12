package payment_api

import (
	payment_dto "payment-service/app/modules/client/payment/api/dtos"

	"github.com/gin-gonic/gin"
)

type IPaymentControllerApi interface {
	GetUserWallet(c *gin.Context)
}

type PaymentControllerApi struct {
	userService IPaymentServiceApi
}

func NewPaymentController(userService IPaymentServiceApi) IPaymentControllerApi {
	return &PaymentControllerApi{
		userService: userService,
	}
}

func (p *PaymentControllerApi) GetUserWallet(c *gin.Context) {

	data := payment_dto.UserCreateReqDTO{
		Username: "cuong01",
		Password: "tiencuong",
		FullName: "Tien Cuong",
	}

	res, err := p.userService.GetUserWallet(data)

	if err != nil {
		c.JSON(400, gin.H{"status": err.Error()})
		return
	}
	c.JSON(200, gin.H{"data": res})

}
