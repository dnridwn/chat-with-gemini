package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type AskRequest struct {
	Message string `json:"message" binding:"required"`
}

var gAI *GeminiAI

func AskHandler(c *gin.Context) {
	var askRequest AskRequest
	if err := c.ShouldBind(&askRequest); err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"status":  false,
			"message": "Validation error",
			"data": map[string]string{
				"errors": err.Error(),
			},
		})
		return
	}

	if gAI == nil {
		gAI = NewGeminiAI(c.Request.Context())
	}

	response, err := gAI.SendMessage(c.Request.Context(), askRequest.Message)
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
