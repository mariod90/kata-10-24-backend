import { TaskService } from '../../../src/application/services/TaskService';
import { Task } from '../../../src/domain/Task';

const mockTaskRepository = {
    save: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
};

describe('TaskService', () => {
    const taskService = new TaskService(mockTaskRepository);

    it('should create a task successfully', async () => {
        const task = new Task(null, 'Test task', 'Test description');
        mockTaskRepository.save.mockResolvedValue(task);

        const createdTask = await taskService.createTask(task);

        expect(mockTaskRepository.save).toHaveBeenCalledWith(task);
        expect(createdTask).toEqual(task);
    });

    it('should return all tasks', async () => {
        const tasks = [new Task(1, 'Test task 1', 'Description 1'), new Task(2, 'Test task 2', 'Description 2')];
        mockTaskRepository.findAll.mockResolvedValue(tasks);

        const result = await taskService.getAllTasks();

        expect(result).toEqual(tasks);
    });

    it('should throw an error when trying to update a non-existent task', async () => {
        const taskId = 999;
        mockTaskRepository.findById.mockResolvedValue(null);

        await expect(taskService.updateTask(taskId, new Task(null, 'Updated title', 'Updated description')))
            .rejects
            .toThrow('Task not found');
    });

    it('should update a task successfully', async () => {
        const taskId = 1;
        const task = new Task(1, 'Original title', 'Original description');
        const updatedTask = new Task(null, 'Updated title', 'Updated description');

        mockTaskRepository.findById.mockResolvedValue(task);
        mockTaskRepository.update.mockResolvedValue(updatedTask);

        const result = await taskService.updateTask(taskId, updatedTask);

        expect(mockTaskRepository.update).toHaveBeenCalledWith(taskId, updatedTask);
        expect(result).toEqual(updatedTask);
    });

    it('should delete a task successfully', async () => {
        const taskId = 1;
        mockTaskRepository.findById.mockResolvedValue(new Task(taskId, 'Test title', 'Test description'));
        mockTaskRepository.delete.mockResolvedValue(true);

        await taskService.deleteTask(taskId);

        expect(mockTaskRepository.delete).toHaveBeenCalledWith(taskId);
    });
});
