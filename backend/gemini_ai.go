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
)

var explicitMode = []*genai.SafetySetting{
	{
		Category:  genai.HarmCategoryHarassment,
		Threshold: genai.HarmBlockNone,
	},
	{
		Category:  genai.HarmCategoryHateSpeech,
		Threshold: genai.HarmBlockNone,
	},
	{
		Category:  genai.HarmCategorySexuallyExplicit,
		Threshold: genai.HarmBlockNone,
	},
	{
		Category:  genai.HarmCategoryDangerousContent,
		Threshold: genai.HarmBlockNone,
	},
}

type GeminiAI struct {
	cs *genai.ChatSession
}

func NewGeminiAI(ctx context.Context) *GeminiAI {
	client, err := genai.NewClient(ctx, option.WithAPIKey(getApiKey()))
	if err != nil {
		panic(err)
	}

	model := client.GenerativeModel(GeminiPro)
	model.SafetySettings = explicitMode

	cs := model.StartChat()

	return &GeminiAI{
		cs: cs,
	}
}

func (g *GeminiAI) SendMessage(ctx context.Context, message string) (*genai.GenerateContentResponse, error) {
	return g.cs.SendMessage(ctx, genai.Text(message))
}

func (g *GeminiAI) SendMessageStream(ctx context.Context, message string) *genai.GenerateContentResponseIterator {
	return g.cs.SendMessageStream(ctx, genai.Text(message))
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
