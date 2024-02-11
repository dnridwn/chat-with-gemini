package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func panicHandlerMiddleware(c *gin.Context) {
	defer func() {
		if err := recover(); err != nil {
			fmt.Printf("Panic: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"status":  false,
				"message": "Internal Server Error",
			})
		}
	}()

	c.Next()
}

func corsMiddleware(c *gin.Context) {
	c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
	c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
	c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
	c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

	if c.Request.Method == "OPTIONS" {
		c.AbortWithStatus(204)
		return
	}

	c.Next()
}
