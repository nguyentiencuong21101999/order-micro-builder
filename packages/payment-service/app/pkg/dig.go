package pkg

import (
	rabbitmq "payment-service/app/pkg/rabbit-mq"
	consumer "payment-service/app/pkg/rabbit-mq/consumer"
	"payment-service/app/pkg/rabbit-mq/publisher"

	"go.uber.org/dig"
)

// Inject pkg
func Inject(container *dig.Container) (err error) {

	if err = container.Provide(rabbitmq.NewRabbitMQ); err != nil {
		return err
	}

	if err = container.Provide(consumer.NewConsumer); err != nil {
		return err
	}

	if err = container.Provide(publisher.NewPublisher); err != nil {
		return err
	}

	return nil
}
