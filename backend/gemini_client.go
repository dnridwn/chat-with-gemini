package main

import (
	"context"
	"fmt"
	"os"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

const geminiPro string = "gemini-pro"

var explicitMode = []*genai.SafetySetting{
	{Category: genai.HarmCategoryHarassment, Threshold: genai.HarmBlockNone},
	{Category: genai.HarmCategoryHateSpeech, Threshold: genai.HarmBlockNone},
	{Category: genai.HarmCategorySexuallyExplicit, Threshold: genai.HarmBlockNone},
	{Category: genai.HarmCategoryDangerousContent, Threshold: genai.HarmBlockNone},
}

type GeminiClient struct {
	*genai.ChatSession
}

func NewGeminiClient(ctx context.Context, apiKey string) *GeminiClient {
	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		panic(err)
	}

	model := client.GenerativeModel(geminiPro)
	model.SafetySettings = explicitMode
	cs := model.StartChat()
	return &GeminiClient{
		ChatSession: cs,
	}
}

func (g *GeminiClient) SendMessageStream(ctx context.Context, msg string) *genai.GenerateContentResponseIterator {
	return g.ChatSession.SendMessageStream(ctx, genai.Text(msg))
}

func getApiKey() string {
	return os.Getenv("GEMINI_AI_API_KEY")
}

func ParseGeminiResponse(resp *genai.GenerateContentResponse) string {
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
