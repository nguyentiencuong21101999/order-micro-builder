package payment_api

import "go.uber.org/dig"

// Inject repositories
func Inject(container *dig.Container) (err error) {

	if err = container.Provide(NewPaymentService); err != nil {
		return err
	}

	if err = container.Provide(NewPaymentController); err != nil {
		return err
	}

	return nil
}
