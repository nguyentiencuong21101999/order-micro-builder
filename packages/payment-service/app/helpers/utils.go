package helpers

import "github.com/mitchellh/mapstructure"

func PlainToInstance[T any](data interface{}) (T, error) {
	var instance T
	err := mapstructure.Decode(data, &instance)
	return instance, err

}
