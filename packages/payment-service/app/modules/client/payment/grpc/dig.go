package payment_grpc

import "go.uber.org/dig"

// Inject repositories
func Inject(container *dig.Container) (err error) {

	if err = container.Provide(NewPaymentServiceGrpc); err != nil {
		return err
	}

	if err = container.Provide(NewPaymentServerGrpc); err != nil {
		return err
	}

	return nil
}
