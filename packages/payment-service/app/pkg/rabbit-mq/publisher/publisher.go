package publisher

import (
	"encoding/json"
	rabbitmq "payment-service/app/pkg/rabbit-mq"

	"github.com/rabbitmq/amqp091-go"
	"go.uber.org/zap"
)

type IPublisher interface {
	Publish(queueName rabbitmq.QueueKey, data interface{}) error
}

type Publisher struct {
	rabbitMq rabbitmq.IRabbitMQ
}

func NewPublisher(rabbitMq rabbitmq.IRabbitMQ) IPublisher {
	return &Publisher{
		rabbitMq: rabbitMq,
	}
}

// Publish : queue name, data
func (p *Publisher) Publish(queueNme rabbitmq.QueueKey, data any) (err error) {
	bytes, err := json.Marshal(data)
	if err != nil {
		return err
	}
	qName := string(queueNme)

	channel, err := p.rabbitMq.Connection().Channel()
	if err != nil {
		return err
	}
	zap.L().Info("Publishing message", zap.Any("queue", qName), zap.Any("data", string(bytes)))
	err = channel.Publish(
		"",    // exchange
		qName, // routing key
		false, // mandatory
		false, // immediate
		amqp091.Publishing{
			ContentType:  "text/plain",
			Body:         bytes,
			DeliveryMode: amqp091.Persistent,
		})

	return err
}
