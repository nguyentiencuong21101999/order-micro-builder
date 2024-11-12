package payment_entity

import "go.uber.org/dig"

// Inject repositories
func Inject(container *dig.Container) (err error) {

	if err = container.Provide(NewPaymentEntity); err != nil {
		return err
	}

	return nil
}
