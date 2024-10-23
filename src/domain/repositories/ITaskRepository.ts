import {Task} from "../Task";

export interface ITaskRepository {
    save(task: Task): Promise<Task>;
    findAll(): Promise<Task[]>;
    findById(id: number): Promise<Task | null>;
    update(id: number, task: Task): Promise<Task>;
    delete(id: number): Promise<boolean>;
}
