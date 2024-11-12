package base

type BaseEntity struct {
	CreatedDate string `gorm:"column:createdDate" json:"createdDate" `
	CreatedBy   string `gorm:"column:createdBy" json:"createdBy"`
	UpdatedDate string `gorm:"column:updatedDate" json:"updatedDate" `
	UpdatedBy   string `gorm:"column:updatedBy" json:"updatedBy"`
}
