package models

type User struct {
	UserId   int    `gorm:"primaryKey;autoIncrement;column:userId" `
	FullName string `gorm:"column:fullName" json:"fullName"`
	Username string `gorm:"column:username" json:"email" `
	Password string `gorm:"column:password" json:"password"`
}

func (User) TableName() string {
	return "User"
}


