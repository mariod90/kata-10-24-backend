import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../../application/services/TaskService';
import { Task } from '../../domain/Task';

export class TaskController {
    private taskService: TaskService;

    constructor(taskService: TaskService) {
        this.taskService = taskService;
    }

    async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { title, description } = req.body;
            const task = new Task(null, title, description);
            const newTask = await this.taskService.createTask(task);
            res.status(201).json(newTask);
        } catch (error) {
            next(error);
        }
    }

    async getAllTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const tasks = await this.taskService.getAllTasks();
            res.json(tasks);
        } catch (error) {
            next(error);
        }
    }

    async updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const { title, description } = req.body;
            const updatedTask = new Task(null, title, description);
            const task = await this.taskService.updateTask(parseInt(id), updatedTask);
            res.json(task);
        } catch (error) {
            next(error);
        }
    }

    async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            await this.taskService.deleteTask(parseInt(id));
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
