package rabbitmq

import (
	"github.com/rabbitmq/amqp091-go"
)

// DataMsg : struct
// type DataMsg struct {
// 	// Key       QueueKey    `json:"key"`
// 	// Data      interface{} `json:"data"`
// 	// Timestamp string      `json:"timestamp"`
// 	OrderId string `json:"orderId"`
// 	UserId  int32  `json:"userId"`
// 	Status  string `json:"status"`
// }

// QueueDeclare : struct
type QueueDeclare struct {
	Name   QueueName
	Topics []TopicDeclare
}

// ExchangeDeclare : struct
type ExchangeDeclare struct {
	Name ExchangeName
	Args amqp091.Table
	Type ExchangeType
}

// TopicDeclare : struct
type TopicDeclare struct {
	Topic        TopicName
	ExchangeName ExchangeName
}

// QueueName : string
type QueueName string

// QueueKey : string
type QueueKey string

// ExchangeName : define name of exchanges
type ExchangeName string

// ExchangeType : define name of exchanges's type
type ExchangeType string

// TopicName : define name of topics
type TopicName string

// ========= TOPIC ========= //

// RabbitMQ topics: define all topic name
const (
	TopicDefault TopicName = ""
	TopicAll     TopicName = "*"
)

// ========= EXCHANGE TYPE ========= //

// RabbitMQ exchanges: define all exchanges name
const (
	ExchangeTypeTopic    ExchangeType = "topic"
	ExchangeTypeDirect   ExchangeType = "direct"
	ExchangeTypeXDelayed ExchangeType = "x-delayed-message"
)

// ========= EXCHANGE NAME ========= //
const ()

// ========= QUEUE NAME ========= //
const (
	DogEgoalEventServiceQueue   QueueName = "dogegoal-event"
	DogEgoalOpenBoxServiceQueue QueueName = "dogegoal-open-box"
)

// ========= QUEUE KEY ========= //
const (
	PaymentCheckQueueName   QueueKey = "payment-check"
	PaymentCheckedQueueName QueueKey = "payment-checked"
)
