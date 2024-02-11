package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

var gAI *GeminiClient

func sendHandler(c *gin.Context) {
	request, exists := c.Get("request")
	if !exists {
		return
	}

	if gAI == nil {
		gAI = NewGeminiClient(c.Request.Context(), getApiKey())
	}

	resp, err := gAI.SendMessage(c.Request.Context(), request.(AskRequest).Message)
	if err != nil {
		panic(err)
	}

	c.JSON(http.StatusOK, gin.H{
		"status": false,
		"data": map[string]any{
			"response": ParseGeminiResponse(resp),
		},
	})
}
