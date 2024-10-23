import { Task } from '../../domain/Task';
import {ITaskRepository} from "../../domain/repositories/ITaskRepository";
import {CustomError} from "../../shared/errors/CustomError";

const ERROR_NOT_FOUND = new CustomError('Task not found', 404);

export class TaskService {
    private taskRepository: ITaskRepository;

    constructor(taskRepository: ITaskRepository) {
        this.taskRepository = taskRepository;
    }

    async createTask(task: Task): Promise<Task> {
        task.validate();
        return this.taskRepository.save(task);
    }

    async getAllTasks(): Promise<Task[]> {
        return this.taskRepository.findAll();
    }

    async updateTask(id: number, updatedTask: Task): Promise<Task> {
        const existingTask = await this.taskRepository.findById(id);
        if (!existingTask) {
            throw ERROR_NOT_FOUND;
        }

        updatedTask.validate();
        return this.taskRepository.update(id, updatedTask);
    }

    async deleteTask(id: number): Promise<void> {
        const task = await this.taskRepository.findById(id);
        if (!task) {
            throw ERROR_NOT_FOUND;
        }
        await this.taskRepository.delete(id);
    }
}
