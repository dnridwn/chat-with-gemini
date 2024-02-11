package main

import (
	"github.com/gin-gonic/gin"
	"google.golang.org/api/iterator"
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

	notify := c.Writer.(gin.ResponseWriter).CloseNotify()
	iter := gAI.SendMessageStream(c.Request.Context(), request.(AskRequest).Message)

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
				c.Writer.Flush()
				panic(err)
			}

			c.SSEvent("message", gin.H{
				"status":  false,
				"message": "Successfully get response",
				"data": map[string]any{
					"response": ParseGeminiResponse(resp),
					"is_eof":   false,
				},
			})
			c.Writer.Flush()
		}
	}
}
