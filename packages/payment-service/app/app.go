package app

import (
	"log"
	"payment-service/app/config"
	"payment-service/app/database"
	"payment-service/app/modules"
	"payment-service/app/pkg"

	"go.uber.org/dig"
)

func BuildContainer(conf *config.Config) *dig.Container {

	container := dig.New()

	// Inject config
	err := container.Provide(func() *config.Config {
		return conf
	})
	if err != nil {
		log.Fatalf("Failed to inject config %v", err)
	}

	// Inject modules
	err = modules.Inject(container)
	if err != nil {
		log.Fatalf("Failed to inject modules instance %v", err)
	}

	// Inject Database
	err = database.Inject(container)
	if err != nil {
		log.Fatalf("Failed to inject database instance %v", err)
	}

	err = pkg.Inject(container)
	if err != nil {
		log.Fatalf("Failed to inject pkg instance %v", err)
	}

	return container
}
