package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type AskRequest struct {
	Message string `json:"message" form:"message" binding:"required"`
}

func sendRequestValidation(c *gin.Context) {
	var request AskRequest
	if err := c.ShouldBind(&request); err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"status":  false,
			"message": "Validation error",
			"data": map[string]string{
				"errors": err.Error(),
			},
		})
	} else {
		c.Set("request", request)
		c.Next()
	}
}
