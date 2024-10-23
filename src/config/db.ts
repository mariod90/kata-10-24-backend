import sqlite3 from 'sqlite3';
import path from 'path';

export const connectToDatabase = (): sqlite3.Database => {
    const db = new sqlite3.Database(path.resolve(__dirname, 'tasks.db'));

    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL
    )`);
    });

    return db;
};
