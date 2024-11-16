package rabbitmq

import (
	"payment-service/app/config"
	"time"

	"github.com/rabbitmq/amqp091-go"
	"go.uber.org/zap"
)

// define rabbitmq constants
const (
	WaitTimeReconnect                  = 5
	ChannelNotifyTimeout time.Duration = 100 * time.Millisecond
	ReconnectInterval    time.Duration = 500 * time.Millisecond
	ReconnectMaxAttempt  int           = 7200
)

// IRabbitMQ interface
type IRabbitMQ interface {
	Connection() *amqp091.Connection
	Connect() error
	Channel() *amqp091.Channel
	CreateChannel() (*amqp091.Channel, error)
	Shutdown() (err error)
}

type RabbitMQ struct {
	conn    *amqp091.Connection
	channel *amqp091.Channel
	conf    *config.Config
}

func NewRabbitMQ(conf *config.Config) IRabbitMQ {
	return &RabbitMQ{
		conf: conf,
	}
}

func (r *RabbitMQ) Connect() error {
	var (
		err error
	)
	for {
		r.conn, err = amqp091.Dial(r.conf.RabbitMqUri)
		if err == nil {
			break
		}
		zap.L().Error("Failed to create new connection to AMQP", zap.Any("err", err))
		time.Sleep(WaitTimeReconnect * time.Second)

	}
	r.channel, err = r.CreateChannel()
	if err != nil {
		return err
	}
	go r.reconnect()
	return nil
}

// Connection exposes the essentials of the current connection.
// You should not normally use this but it is there for special
// use cases.
func (r *RabbitMQ) Connection() *amqp091.Connection {
	return r.conn
}

func (r *RabbitMQ) Channel() *amqp091.Channel {
	return r.channel
}

// Shutdown triggers a normal shutdown. Use this when you wish
// to shutdown your current connection or if you are shutting
// down the application.
func (r *RabbitMQ) Shutdown() error {
	if r.conn != nil {
		return r.conn.Close()
	}

	return nil
}

func (r *RabbitMQ) CreateChannel() (*amqp091.Channel, error) {
	if r.channel == nil {
		channel, err := r.conn.Channel()
		if err != nil {
			zap.L().Error("Failed to create new channel", zap.Any("err", err))
			return nil, err
		}
		r.channel = channel
	}
	return r.channel, nil
}

func (r *RabbitMQ) reconnect() {
WATCH:

	conErr := <-r.conn.NotifyClose(make(chan *amqp091.Error))
	if conErr != nil {
		zap.L().Info("CRITICAL: Connection dropped, reconnecting")

		var err error

		// for i := 1; i <= ReconnectMaxAttempt; i++ {
		// 	r.mux.RLock()
		// 	r.connection, err = amqp.Dial(r.conf.RabbitMQ)
		// 	r.mux.RUnlock()

		// 	if err == nil {
		// 		zap.L().Info("INFO: Reconnected")
		// 		goto WATCH
		// 	}

		// 	time.Sleep(ReconnectInterval)
		// }

		zap.L().Error("CRITICAL: Failed to reconnect", zap.Error(err))
		goto WATCH
	} else {
		zap.L().Info("INFO: Connection dropped normally, will not reconnect")
	}
}
