package payment_consumer

import (
	"payment-service/app/database"
	"payment-service/app/helpers"
	errorRes "payment-service/app/helpers/errors"
	payment_entity "payment-service/app/modules/client/payment/entities"
	rabbitmq "payment-service/app/pkg/rabbit-mq"
	"payment-service/app/pkg/rabbit-mq/publisher"

	"go.uber.org/zap"
	"gorm.io/gorm"
)

type IPaymentServiceConsumer interface {
	Checkout(req []byte)
}

type PaymentServiceConsumer struct {
	paymentEntity payment_entity.IPaymentEntity
	db            database.IDatabase
	publisher     publisher.IPublisher
}

func NewPaymentServiceConsumer(paymentEntity payment_entity.IPaymentEntity, db database.IDatabase, publisher publisher.IPublisher) IPaymentServiceConsumer {
	return &PaymentServiceConsumer{
		paymentEntity: paymentEntity,
		db:            db,
		publisher:     publisher,
	}
}

func (p *PaymentServiceConsumer) Checkout(param []byte) {
	var data PaymentCheckDataMsg
	var totalPrice float64 = 0
	var err error

	helpers.TransferDataMsg(param, &data)

	// s.paymentEntity.GetOne(data.UserId)
	// return data, nil
	err = p.db.WithTransaction(func(tx *gorm.DB) error {

		if len(data.Products) == 0 {
			return errorRes.ProductNotFound
		}

		for _, product := range data.Products {
			totalPrice += product.Price * float64(product.Quality)
		}

		payment, err := p.paymentEntity.GetByUserId(data.UserId, tx)
		if err != nil {
			return err
		}

		if payment.Balance-totalPrice < 0 {
			return errorRes.BalanceNotEnough
		}

		payment.Balance = payment.Balance - 1
		return p.paymentEntity.Update(payment_entity.PaymentEntity{Balance: payment.Balance}, payment_entity.PaymentEntity{UserId: data.UserId}, nil)
	})

	if err != nil {
		data.Status = OrderStatusType["PaymentCheckedFailed"]
	} else {
		data.Status = OrderStatusType["PaymentCheckedSuccess"]
	}
	data.Error = errorRes.HandleError(err)
	// Publish to another service
	err = p.publisher.Publish(rabbitmq.PaymentCheckedQueueName, data)
	zap.L().Info("publish payment checked", zap.Any("data", data), zap.Any("err", err))
}
