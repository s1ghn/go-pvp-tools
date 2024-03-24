import betterSqlite3 from "better-sqlite3";

const db = betterSqlite3("data/database.db");

// enable WAL mode
db.pragma("journal_mode = WAL");

export default db;