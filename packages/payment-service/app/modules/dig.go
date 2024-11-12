package modules

import (
	payment_api_client "payment-service/app/modules/client/payment/api"
	payment_entity "payment-service/app/modules/client/payment/entities"
	payment_grpc_client "payment-service/app/modules/client/payment/grpc"

	"go.uber.org/dig"
)

// Inject repositories
func Inject(container *dig.Container) (err error) {

	if err = payment_entity.Inject(container); err != nil {
		return err
	}

	if err = payment_api_client.Inject(container); err != nil {
		return err
	}

	if err = payment_grpc_client.Inject(container); err != nil {
		return err
	}

	if err = container.Provide(NewServer); err != nil {
		return err
	}

	return nil
}
