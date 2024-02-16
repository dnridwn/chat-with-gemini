import database from "../database";

const tableName = 'chat_sessions';

export interface ChatSession {
    id: number,
    histories: string|null
}

export const findById = async function(id: number): Promise<ChatSession> {
    const result: any = await (await database()).query(`SELECT * FROM ${tableName} WHERE deleted_at IS NULL AND id = ? LIMIT 1`, id);
    const rows = result[0];
    if (rows.length == 0) {
        return {} as ChatSession;
    }
    return rows[0];
}

export const create = async function(data: ChatSession): Promise<number> {
    const result = await (await database()).query(`INSERT INTO ${tableName} (histories, created_at, updated_at) VALUES (?, NOW(), NOW())`, data.histories);
    const row: any = result[0];
    return row.insertId;
}

export const updateById = async function(id: number, data: ChatSession): Promise<number> {
    const result: any = await (await database()).query(`UPDATE ${tableName} SET histories = ?, updated_at = NOW() WHERE deleted_at IS NULL AND ID = ?`, [data.histories, id]);
    const row: any = result[0];
    return row.affectedRows;
}
