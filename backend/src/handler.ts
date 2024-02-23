import { Request, Response } from "express";
import GeminiClient from "./services/gemini-client";
import config from "./config";
import database from "./database";
import * as ChatSessionModel from './models/chat-session';

const geminiClient = new GeminiClient(config.GEMINI_API_KEY);

function safetyHandler(handler: Function) {
    return function(req: Request, res: Response, next: any) {
        try {
            handler(req, res, next);
        } catch (error) {
            next(error);
        }
    }
}

async function homeHandler(_: Request, res: Response) {
    res.json({
        error: false,
        message: 'Service is running...'
    });
}

async function sendMessageHandler(req: Request, res: Response, next: any) {
    const reqBody = req.body;

    let sessionID = reqBody.session_id;
    if (!sessionID) {
        try {
            const insertID = await ChatSessionModel.create({ histories: '' } as ChatSessionModel.ChatSession);
            sessionID = insertID;
        } catch (error) {
            return next(error);
        }
    }

    let chatSession!: ChatSessionModel.ChatSession;
    try {
        chatSession = await ChatSessionModel.findById(sessionID);
    } catch (error) {
        return next(error);
    }

    if (!chatSession.id) {
        return res.json({
            error: true,
            message: 'Invalid chat session'
        });
    }

    const chat = geminiClient.startChat(chatSession?.histories ? JSON.parse(chatSession.histories) : []);
    const response = await chat.sendMessage(reqBody.message);
    const histories: any = await chat.getHistory();

    try {
        await ChatSessionModel.updateById(chatSession.id as number, { histories: JSON.stringify(histories) } as ChatSessionModel.ChatSession)
    } catch (error) {
        return next(error);
    }

    res.json({
        error: false,
        message: 'Successfully get response from gemini',
        data: {
            response,
            session: {
                id: chatSession?.id
            }
        }
    });
}

export default {
    safetyHandler, homeHandler, sendMessageHandler
}
