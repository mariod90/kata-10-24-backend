import { Request, Response } from 'express';
import {TaskController} from "../../../src/infrastructure/web/TaskController";
import {TaskService} from "../../../src/application/services/TaskService";
import {Task} from "../../../src/domain/Task";

const mockTaskService = {
    createTask: jest.fn(),
    getAllTasks: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn()
};

const taskController = new TaskController(mockTaskService as unknown as TaskService);

const mockRequest = {} as Request;
const mockResponse = {} as Response;
const mockNext = jest.fn();

mockResponse.status = jest.fn().mockReturnThis();
mockResponse.json = jest.fn();
mockResponse.send = jest.fn();

describe('TaskController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createTask', () => {
        it('should create a new task and return it', async () => {
            const newTask = new Task(1, 'Test Task', 'Test Description');
            mockRequest.body = { title: 'Test Task', description: 'Test Description' };
            mockTaskService.createTask.mockResolvedValue(newTask);

            await taskController.createTask(mockRequest, mockResponse, mockNext);

            expect(mockTaskService.createTask).toHaveBeenCalledWith(expect.any(Task));
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(newTask);
        });

        it('should call next with an error if task creation fails', async () => {
            const error = new Error('Task creation failed');
            mockRequest.body = { title: 'Test Task', description: 'Test Description' };
            mockTaskService.createTask.mockRejectedValue(error);

            await taskController.createTask(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('getAllTasks', () => {
        it('should return all tasks', async () => {
            const tasks = [new Task(1, 'Task 1', 'Description 1'), new Task(2, 'Task 2', 'Description 2')];
            mockTaskService.getAllTasks.mockResolvedValue(tasks);

            await taskController.getAllTasks(mockRequest, mockResponse, mockNext);

            expect(mockTaskService.getAllTasks).toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith(tasks);
        });

        it('should call next with an error if fetching tasks fails', async () => {
            const error = new Error('Failed to fetch tasks');
            mockTaskService.getAllTasks.mockRejectedValue(error);

            await taskController.getAllTasks(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('updateTask', () => {
        it('should update an existing task and return it', async () => {
            const updatedTask = new Task(1, 'Updated Task', 'Updated Description');
            mockRequest.params = { id: '1' };
            mockRequest.body = { title: 'Updated Task', description: 'Updated Description' };
            mockTaskService.updateTask.mockResolvedValue(updatedTask);

            await taskController.updateTask(mockRequest, mockResponse, mockNext);

            expect(mockTaskService.updateTask).toHaveBeenCalledWith(1, expect.any(Task));
            expect(mockResponse.json).toHaveBeenCalledWith(updatedTask);
        });

        it('should call next with an error if updating a task fails', async () => {
            const error = new Error('Task update failed');
            mockRequest.params = { id: '1' };
            mockRequest.body = { title: 'Updated Task', description: 'Updated Description' };
            mockTaskService.updateTask.mockRejectedValue(error);

            await taskController.updateTask(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('deleteTask', () => {
        it('should delete an existing task and return 204', async () => {
            mockRequest.params = { id: '1' };
            mockTaskService.deleteTask.mockResolvedValue(true);

            await taskController.deleteTask(mockRequest, mockResponse, mockNext);

            expect(mockTaskService.deleteTask).toHaveBeenCalledWith(1);
            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.send).toHaveBeenCalled();
        });

        it('should call next with an error if deleting a task fails', async () => {
            const error = new Error('Task deletion failed');
            mockRequest.params = { id: '1' };
            mockTaskService.deleteTask.mockRejectedValue(error);

            await taskController.deleteTask(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });
});
