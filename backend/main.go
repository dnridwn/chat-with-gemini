package main

import (
	"log"

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

	r.Use(panicHandlerMiddleware, gin.Logger(), corsMiddleware)
	r.POST("send", sendRequestValidation, sendHandler)

	return r
}
