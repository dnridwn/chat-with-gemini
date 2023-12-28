package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"google.golang.org/api/iterator"
)

type AskRequest struct {
	Message string `json:"message" form:"message" binding:"required"`
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
			"response": ParseGeminiResponse(response),
		},
	})
}

func AskWithStreamHandler(c *gin.Context) {
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

	notify := c.Writer.(gin.ResponseWriter).CloseNotify()

	if gAI == nil {
		gAI = NewGeminiAI(c.Request.Context())
	}

	iter := gAI.SendMessageStream(c.Request.Context(), askRequest.Message)
	for {
		select {
		case <-notify:
			return
		default:
			resp, err := iter.Next()
			if err == iterator.Done {
				c.SSEvent("message", gin.H{
					"status":  false,
					"message": "Successfully get response",
					"data": map[string]any{
						"response": "",
						"is_eof":   true,
					},
				})
				c.Writer.Flush()
				break
			}

			if err != nil {
				panic(err)
			}

			parsedReponse := ParseGeminiResponse(resp)
			c.SSEvent("message", gin.H{
				"status":  false,
				"message": "Successfully get response",
				"data": map[string]any{
					"response": parsedReponse,
					"is_eof":   false,
				},
			})
			c.Writer.Flush()
		}
	}
}
