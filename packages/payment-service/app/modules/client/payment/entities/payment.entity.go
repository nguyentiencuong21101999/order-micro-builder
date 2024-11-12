package payment_entity

import (
	"fmt"
	"payment-service/app/base"
	"payment-service/app/database"
)

type IPaymentEntity interface {
	GetUserWallet(userId int)
}

type PaymentEntity struct {
	base.BaseEntity
	UserId  int     `gorm:"primaryKey;autoIncrement;column:userId" `
	Balance float64 `gorm:"column:balance" json:"balance"`

	database database.IDatabase
}

func NewPaymentEntity(database database.IDatabase) IPaymentEntity {
	return &PaymentEntity{
		database: database,
	}
}

func (PaymentEntity) TableName() string {
	return "payment"
}

func (p *PaymentEntity) GetUserWallet(userId int) {
	var payments []PaymentEntity
	p.database.GetModel(&PaymentEntity{}).Where("userId = ?", userId).Find(&payments)
	fmt.Println(payments)
}
