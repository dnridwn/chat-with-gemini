package main

import (
	"context"
	"fmt"
	"os"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

const (
	GeminiPro       string = "gemini-pro"
	GeminiProVision string = "gemini-pro-vision"
	Embedding001    string = "embedding-001"
)

type GeminiAI struct {
	ctx    context.Context
	client *genai.Client
	model  *genai.GenerativeModel
	cs     *genai.ChatSession
}

func NewGeminiAI(ctx context.Context) *GeminiAI {
	client, err := genai.NewClient(ctx, option.WithAPIKey(getApiKey()))
	if err != nil {
		panic(err)
	}

	model := client.GenerativeModel(GeminiPro)
	cs := model.StartChat()

	return &GeminiAI{
		ctx:    ctx,
		client: client,
		model:  model,
		cs:     cs,
	}
}

func (g *GeminiAI) SendMessage(ctx context.Context, message string) (string, error) {
	resp, err := g.cs.SendMessage(ctx, genai.Text(message))
	if err != nil {
		return "", err
	}

	return parseResponse(resp), nil
}

func (g *GeminiAI) Close() {
	g.client.Close()
}

func getApiKey() string {
	return os.Getenv("GEMINI_AI_API_KEY")
}

func parseResponse(resp *genai.GenerateContentResponse) string {
	var response string
	for _, cand := range resp.Candidates {
		if cand.Content != nil {
			for _, part := range cand.Content.Parts {
				response += fmt.Sprintf("%v", part)
			}
		}
	}

	return response
}
