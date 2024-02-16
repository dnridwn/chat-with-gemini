import { ChatSession, Content, GenerativeModel, GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, SafetySetting } from "@google/generative-ai";

const safetySettings: Array<SafetySetting> = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE
    }
];

class GeminiClient {
    private model!: GenerativeModel;
    private chatSession!: ChatSession;

    constructor(apiKey: string) {
        const genai = new GoogleGenerativeAI(apiKey);
        this.model = genai.getGenerativeModel({ model: 'gemini-pro' });
    }

    startChat(history: any = []): GeminiClient {
        this.chatSession = this.model.startChat({
            history: history,
            safetySettings
        });
        return this;
    }

    async sendMessage(message: string) {
        const result = await this.chatSession?.sendMessage(message);
        return result.response.text();
    }

    getHistory(): Promise<Array<Content>> {
        return this.chatSession.getHistory();
    }
}

export default GeminiClient;