package errorRes

import (
	"encoding/json"
	"fmt"
	"log"
)

type ErrorResp struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Status  int    `json:"status"`
}

var (
	BadRequest = &ErrorResp{
		Code:    "err.badRequest",
		Message: "Bad Request",
		Status:  400,
	}

	InternalServerError = &ErrorResp{
		Code:    "err.internalServerError",
		Message: "Internal Server Error",
		Status:  500,
	}

	PaymentNotFound = &ErrorResp{
		Code:    "err.paymentNotFound",
		Message: "Payment not found",
		Status:  400,
	}

	ProductNotFound = &ErrorResp{
		Code:    "err.productNotFound",
		Message: "Product not found",
		Status:  400,
	}

	BalanceNotEnough = &ErrorResp{
		Code:    "err.balanceNotEnough",
		Message: "Balance not enough",
		Status:  400,
	}
)

func (e *ErrorResp) Error() string {
	return fmt.Sprintf("Code: %s, Message: %s, Status: %d", e.Code, e.Message, e.Status)
}

func HandleError(err error) *ErrorResp {
	if err == nil {
		return nil
	}

	switch e := err.(type) {
	case *ErrorResp:
		return e

	default:
		log.Printf("Error: %v", err)

		errResp := ErrorResp{
			Code:    InternalServerError.Code,
			Message: fmt.Sprintf("%v", err),
			Status:  InternalServerError.Status,
		}

		return &errResp
	}
}

func HandleGrpcError(err error) error {
	if err == nil {
		return nil
	}

	switch e := err.(type) {
	case *ErrorResp: // Similar to checking instance of ErrorResp in JS
		// Merge the custom error response
		mergedErr := *e
		mergedErr.Status = BadRequest.Status // Assign appropriate status code
		// Marshal the error to JSON
		errRespJSON, _ := json.Marshal(mergedErr)
		return fmt.Errorf(string(errRespJSON))

	default:
		// If it's not an ErrorResp, create a generic internal server error
		log.Printf("Error: %v", err) // Equivalent of logger.error in JS

		errResp := ErrorResp{
			Code:    InternalServerError.Code,
			Message: fmt.Sprintf("%v", err), // Convert the generic error to string
			Status:  InternalServerError.Status,
		}

		// Marshal the error response to JSON and send it
		errRespJSON, _ := json.Marshal(errResp)
		return (fmt.Errorf(string(errRespJSON)))
	}
}
