package database

import (
	"payment-service/app/config"
	"payment-service/app/database/connection"

	"fmt"
	"log"

	"go.uber.org/zap"
	"gorm.io/gorm"
)

// IDatabase interface
type IDatabase interface {
	GetInstance() *gorm.DB
	GetModel(model interface{}) (tx *gorm.DB)
	WithTransaction(callback func(*gorm.DB) error) error
}

type Database struct {
	db *gorm.DB
}

func NewDatabase() IDatabase {
	conf := config.GetConfig()
	println(conf)
	db, err := connection.Init(conf)
	if err != nil {
		log.Fatal("database.Init", zap.Error(err))
	}
	fmt.Println("Database connected")

	return &Database{db: db}
}

func (d *Database) GetInstance() *gorm.DB {
	return d.db
}

func (d *Database) GetModel(model interface{}) (tx *gorm.DB) {
	return d.db.Model(&model)
}

// WithTransaction : callback
func (d *Database) WithTransaction(callback func(*gorm.DB) error) error {
	tx := d.db.Begin()

	if err := callback(tx); err != nil {
		tx.Rollback()
		zap.L().Info("Rollback", zap.Any("----", err))
		return err
	}

	if err := tx.Commit().Error; err != nil {
		return err
	}
	zap.L().Info("Commit")

	return nil
}
