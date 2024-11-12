package payment_dto_client

type UserCreateReqDTO struct {
	Username string `validate:"required" json:"username"`
	Password string `validate:"required" json:"password"`
	FullName string `validate:"required" json:"fullName"`
}
