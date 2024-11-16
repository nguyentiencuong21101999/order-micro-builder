package helpers

import (
	"encoding/json"

	"github.com/mitchellh/mapstructure"
	"go.uber.org/zap"
)

func PlainToInstance[T any](data interface{}) (T, error) {
	var instance T
	err := mapstructure.Decode(data, &instance)
	return instance, err

}

func TransferDataMsg(msgBody []byte, data interface{}) {
	err := json.Unmarshal(msgBody, data)
	if err != nil {
		zap.L().Error("failed to unmarshal message", zap.Error(err))
		return
	}

}
