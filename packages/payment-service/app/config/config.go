package config

import (
	"log"

	"github.com/caarlos0/env"
	"github.com/joho/godotenv"
)

// Config : struct
type Config struct {
	Environment string `env:"ENVIRONMENT" json:"environment"`
	Port        int    `env:"PORT" json:"port"`
	DbUri       string `env:"DB_URI" json:"dbUri"`
	RabbitMqUri string `env:"RABBITMQ_URI" json:"rabbitMqUri"`
	GrpcPort    string `env:"GRPC_PORT" json:"grpcPort"`
}

var (
	config Config
)

func init() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	if err := env.Parse(&config); err != nil {
		log.Fatal("Error on parsing configuration file.", err)
	}

	// log.Printf(`
	// env: %s | port: %d | dbUri: %s`,
	// 	config.Environment, config.Port, config.DbUri,
	// )
}

// GetConfig :
func GetConfig() *Config {
	return &config
}
