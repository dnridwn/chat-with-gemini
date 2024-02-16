import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import handler from './handler';
import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";
import config from './config';

const app = express();
const port = 8080;
const sentryDSN = process.env.SENTRY_DSN || '';

Sentry.init({
    dsn: sentryDSN,
    integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.Express({ app }),
        new ProfilingIntegration(),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
});

app.use(
    Sentry.Handlers.requestHandler(),
    Sentry.Handlers.tracingHandler(),
    cors(),
    bodyParser.json()
);
app.get('/', handler.safetyHandler(handler.homeHandler));
app.post('/send', handler.safetyHandler(handler.sendMessageHandler));
app.use(
    Sentry.Handlers.errorHandler(),
    (err: any, _: Request, res: Response, __) => {
        res.status(500).json({
            error: true,
            message: 'Something went wrong. Please try again later',
            data: {
                details: config.APP_ENV == 'debug' ? err : null
            }
        });
    }
);

app.listen(port, async () => {
    console.log(`Server is running at http://localhost:${port}`);
});
