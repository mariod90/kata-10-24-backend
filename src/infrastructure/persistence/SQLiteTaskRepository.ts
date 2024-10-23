import { Task } from '../../domain/Task';
import { connectToDatabase } from '../../config/db';
import {ITaskRepository} from "../../domain/repositories/ITaskRepository";


export class SQLiteTaskRepository implements ITaskRepository {
    private db = connectToDatabase();

    save(task: Task): Promise<Task> {
        return new Promise((resolve, reject) => {
            this.db.run(
                'INSERT INTO tasks (title, description) VALUES (?, ?)',
                [task.title, task.description],
                function (err: Error) {
                    if (err) return reject(err);
                    resolve(new Task(this.lastID, task.title, task.description));
                }
            );
        });
    }

    findAll(): Promise<Task[]> {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM tasks', (err: Error, rows: any[]) => {
                if (err) return reject(err);
                resolve(rows.map(row => new Task(row.id, row.title, row.description)));
            });
        });
    }

    findById(id: number): Promise<Task | null> {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM tasks WHERE id = ?', [id], (err: Error, row: any) => {
                if (err) return reject(err);
                if (!row) return resolve(null);
                resolve(new Task(row.id, row.title, row.description));
            });
        });
    }

    update(id: number, task: Task): Promise<Task> {
        return new Promise((resolve, reject) => {
            this.db.run(
                'UPDATE tasks SET title = ?, description = ? WHERE id = ?',
                [task.title, task.description, id],
                function (err: Error) {
                    if (err) return reject(err);
                    resolve(new Task(id, task.title, task.description));
                }
            );
        });
    }

    delete(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM tasks WHERE id = ?', [id], function (err: Error) {
                if (err) return reject(err);
                resolve(true);
            });
        });
    }
}
