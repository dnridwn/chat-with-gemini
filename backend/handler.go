package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type AskRequest struct {
	Message string `json:"message" form:"message" binding:"required"`
}

func AskHandler(c *gin.Context) {
	var askRequest AskRequest
	if err := c.ShouldBind(&askRequest); err != nil {
		c.JSON(http.StatusOK, gin.H{
			"status":  false,
			"message": "Validation error",
			"data": map[string]string{
				"errors": err.Error(),
			},
		})
		return
	}

	gAI := NewGeminiAI(c.Request.Context())
	response, err := gAI.Ask(askRequest.Message)
	if err != nil {
		panic(err)
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  true,
		"message": "Successfully get response",
		"data": map[string]string{
			"response": response,
		},
	})
}
