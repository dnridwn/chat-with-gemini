// import * as dotenv from 'dotenv';
// dotenv.config({ path: __dirname + '/../.env' });

export default {
    // app
    APP_ENV: process.env.APP_ENV || 'debug',
    APP_PORT: process.env.APP_PORT || 8080,

    // mongo
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || 3306,
    DB_USER: process.env.DB_USER || 'root',
    DB_PASS: process.env.DB_PASS || '',
    DB_NAME: process.env.DB_NAME || 'database',

    // gemini
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || ''
}
