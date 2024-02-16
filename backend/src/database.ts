import mysql2, { Connection } from 'mysql2/promise';
import config from './config';

const dbHost = config.DB_HOST;
const dbPort = config.DB_PORT;
const dbUser = config.DB_USER;
const dbPass = config.DB_PASS;
const dbName = config.DB_NAME;

async function database(): Promise<Connection> {
    return mysql2.createConnection({
        host: dbHost,
        port: dbPort as number,
        user: dbUser,
        password: dbPass,
        database: dbName
    });
}

export default database;