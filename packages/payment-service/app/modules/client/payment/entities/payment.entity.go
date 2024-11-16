package payment_entity

import (
	"payment-service/app/base"
	"payment-service/app/database"
	paymentPb "protobuf-service/gen/go/payment-service/client/payment"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type IPaymentEntity interface {
	Update(data interface{}, conditions interface{}, tx *gorm.DB) error
	GetByUserId(UserId int32, tx *gorm.DB) (*paymentPb.GetUserWalletResGrpc, error)
}

type PaymentEntity struct {
	base.BaseEntity
	UserId  int32   `gorm:"primaryKey;autoIncrement;column:userId" `
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

func (p *PaymentEntity) GetByUserId(UserId int32, tx *gorm.DB) (*paymentPb.GetUserWalletResGrpc, error) {
	var (
		payments PaymentEntity
		err      error
	)

	if tx != nil {
		err = tx.Where("userId = ?", UserId).First(&payments).Clauses(clause.Locking{Strength: "UPDATE"}).Error

	} else {
		err = p.database.GetModel(&PaymentEntity{}).Where("userId = ?", UserId).First(&payments).Error
	}
	if err != nil {
		return nil, err
	}

	return &paymentPb.GetUserWalletResGrpc{
		UserId:  UserId,
		Balance: payments.Balance,
	}, nil
}

func (p *PaymentEntity) Update(data interface{}, conditions interface{}, tx *gorm.DB) error {
	if tx != nil {
		return tx.Model(&PaymentEntity{}).Where(conditions).Updates(data).Error
	}
	return p.database.GetModel(&PaymentEntity{}).Where(conditions).Updates(data).Error

}
