package connection

import (
	"payment-service/app/config"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Init(config *config.Config) (*gorm.DB, error) {
	logMode := logger.Error
	if config.Environment != "production" {
		logMode = logger.Info
	}
	databaseConn, err := gorm.Open(mysql.Open(config.DbUri), &gorm.Config{
		Logger: logger.Default.LogMode(logMode),
	})

	databaseConn = databaseConn.Set("gorm:table_options", "ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_bin auto_increment=1")
	// skip save associations of gorm -> manual save by code
	databaseConn = databaseConn.Set("gorm:save_associations", false)
	databaseConn = databaseConn.Set("gorm:association_save_reference", true)

	db, _ := databaseConn.DB()
	db.SetMaxOpenConns(20)
	db.SetMaxIdleConns(10)

	return databaseConn, err
}
