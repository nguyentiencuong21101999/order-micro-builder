package modules

import (
	payment_api "payment-service/app/modules/client/payment/api"
	payment_consumer "payment-service/app/modules/client/payment/consumer"
	payment_entity "payment-service/app/modules/client/payment/entities"
	payment_grpc "payment-service/app/modules/client/payment/grpc"

	"go.uber.org/dig"
)

// Inject repositories
func Inject(container *dig.Container) (err error) {

	if err = payment_entity.Inject(container); err != nil {
		return err
	}

	if err = payment_api.Inject(container); err != nil {
		return err
	}

	if err = payment_grpc.Inject(container); err != nil {
		return err
	}

	if err = container.Provide(payment_consumer.NewPaymentServiceConsumer); err != nil {
		return err
	}

	if err = container.Provide(NewServer); err != nil {
		return err
	}

	return nil
}
