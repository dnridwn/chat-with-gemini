package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	loadENV()

	r := route()
	r.Run()
}

func loadENV() {
	if err := godotenv.Load(); err != nil {
		log.Fatal(err)
	}
}

func route() *gin.Engine {
	r := gin.New()
	r.Use(func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				fmt.Println(fmt.Sprintf("Panic: %v", err))
				c.JSON(http.StatusInternalServerError, gin.H{
					"status":  false,
					"message": "Internal Server Error",
				})
			}
		}()

		c.Next()
	})
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})
	r.Use(gin.Logger())
	r.POST("ask", AskHandler)

	return r
}
