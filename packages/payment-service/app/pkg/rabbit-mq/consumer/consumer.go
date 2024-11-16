package consumer

import (
	errorRes "payment-service/app/helpers/errors"
	payment_consumer "payment-service/app/modules/client/payment/consumer"
	rabbitmq "payment-service/app/pkg/rabbit-mq"

	//payment_consumer "payment-service/app/modules/client/payment/consumer"

	"github.com/rabbitmq/amqp091-go"
	"go.uber.org/zap"
)

type IConsumerRabbitMQ interface {
	Consume()
	Consuming() (chan amqp091.Delivery, chan error)
}

type ConsumerRabbitMQ struct {
	rabbitMq           rabbitmq.IRabbitMQ
	paymentSvrConsumer payment_consumer.IPaymentServiceConsumer
}

func NewConsumer(rabbitMq rabbitmq.IRabbitMQ, paymentSvrConsumer payment_consumer.IPaymentServiceConsumer) IConsumerRabbitMQ {
	return &ConsumerRabbitMQ{
		rabbitMq:           rabbitMq,
		paymentSvrConsumer: paymentSvrConsumer,
	}
}

// Consume : consuming message
func (c *ConsumerRabbitMQ) Consume() {
	err := c.rabbitMq.Connect()
	if err != nil {
		zap.L().Error("Failed to connect rabbitmq", zap.Error(err))
		panic(err)
	}

WATCH:
	msgC, errC := c.Consuming()
	for {
		select {
		case msg := <-msgC:
			go c.handle(msg)
		case err := <-errC:
			zap.L().Error("Consuming: ", zap.Error(err))
			if err == errorRes.BadRequest {
				goto WATCH
			}

		}
	}
}
func (c *ConsumerRabbitMQ) handle(msg amqp091.Delivery) {
	// zap.L().Debug("receive msg", zap.Any("key", msg.RoutingKey), zap.Any("msg", string(msg.Body)))

	// zap.L().Info("Acknowledged message", zap.Any("msg", msg.Ack(false)))
	defer func() {
		if err := msg.Ack(false); err != nil {
			zap.L().Error("Error acknowledging message", zap.Error(err))
		} else {
			zap.L().Info("Acknowledged message", zap.Any("msg", string(msg.Body)))
		}
	}()

	switch rabbitmq.QueueName(msg.RoutingKey) {
	case rabbitmq.QueueName(rabbitmq.PaymentCheckQueueName):
		c.paymentSvrConsumer.Checkout(msg.Body)
	}
}

func (c *ConsumerRabbitMQ) Consuming() (chan amqp091.Delivery, chan error) {
	msgCh := make(chan amqp091.Delivery)
	errCh := make(chan error)

	queues := []rabbitmq.QueueKey{rabbitmq.PaymentCheckQueueName}

	for _, queue := range queues {
		qName := string(queue)

		_, err := c.rabbitMq.Channel().QueueDeclare(qName, true, false, false, false, nil)
		if err != nil {
			zap.L().Info("Declared queue failed: ", zap.Any("name", err))
			errCh <- err

		}

		go func(q string) {
			msgs, err := c.rabbitMq.Channel().Consume(q, "", false, false, false, false, nil)
			if err != nil {
				errCh <- err
			}

			forever := make(chan bool)

			go func(reconnect chan bool) {

				go func(reconnect chan bool) {
					conErr := <-c.rabbitMq.Connection().NotifyClose(make(chan *amqp091.Error))
					if conErr != nil {
						reconnect <- true
					}
				}(reconnect)

				for d := range msgs {
					msgCh <- d
				}
			}(forever)
			reconnect := <-forever

			if reconnect {
				errCh <- errorRes.InternalServerError
			}
		}(qName)
	}

	return msgCh, errCh
}
