
import {SQLiteTaskRepository} from "../../../src/infrastructure/persistence/SQLiteTaskRepository";
import {connectToDatabase} from "../../../src/config/db";
import {Task} from "../../../src/domain/Task";

jest.mock('../../../src/config/db');

describe('SQLiteTaskRepository', () => {
    let taskRepository: SQLiteTaskRepository;
    let mockDb: any;

    beforeEach(() => {
        mockDb = {
            run: jest.fn(),
            all: jest.fn(),
            get: jest.fn(),
        };
        (connectToDatabase as jest.Mock).mockReturnValue(mockDb);
        taskRepository = new SQLiteTaskRepository();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('save', () => {
        it('should throw an error if saving the task fails', async () => {
            const task = new Task(1, 'Test Task', 'Test Description');
            mockDb.run.mockImplementation((_query: string, _params: any[], callback: Function) => {
                callback(new Error('Failed to save task'));
            });

            await expect(taskRepository.save(task)).rejects.toThrow('Failed to save task');
        });
    });

    describe('findAll', () => {
        it('should return a list of tasks', async () => {
            const mockRows = [
                { id: 1, title: 'Task 1', description: 'Description 1' },
                { id: 2, title: 'Task 2', description: 'Description 2' },
            ];
            mockDb.all.mockImplementation((_query: string, callback: Function) => {
                callback(null, mockRows);
            });

            const result = await taskRepository.findAll();

            expect(mockDb.all).toHaveBeenCalledWith('SELECT * FROM tasks', expect.any(Function));
            expect(result).toEqual([
                new Task(1, 'Task 1', 'Description 1'),
                new Task(2, 'Task 2', 'Description 2'),
            ]);
        });

        it('should throw an error if fetching tasks fails', async () => {
            mockDb.all.mockImplementation((_query: string, callback: Function) => {
                callback(new Error('Failed to fetch tasks'), null);
            });

            await expect(taskRepository.findAll()).rejects.toThrow('Failed to fetch tasks');
        });
    });

    describe('findById', () => {
        it('should return a task if found', async () => {
            const mockRow = { id: 1, title: 'Task 1', description: 'Description 1' };
            mockDb.get.mockImplementation((_query: string, _params: any[], callback: Function) => {
                callback(null, mockRow);
            });

            const result = await taskRepository.findById(1);

            expect(mockDb.get).toHaveBeenCalledWith('SELECT * FROM tasks WHERE id = ?', [1], expect.any(Function));
            expect(result).toEqual(new Task(1, 'Task 1', 'Description 1'));
        });

        it('should return null if no task is found', async () => {
            mockDb.get.mockImplementation((_query: string, _params: any[], callback: Function) => {
                callback(null, null);
            });

            const result = await taskRepository.findById(999);

            expect(mockDb.get).toHaveBeenCalledWith('SELECT * FROM tasks WHERE id = ?', [999], expect.any(Function));
            expect(result).toBeNull();
        });

        it('should throw an error if fetching the task fails', async () => {
            mockDb.get.mockImplementation((_query: string, _params: any[], callback: Function) => {
                callback(new Error('Failed to fetch task'), null);
            });

            await expect(taskRepository.findById(1)).rejects.toThrow('Failed to fetch task');
        });
    });

    describe('update', () => {
        it('should update a task and return the updated task', async () => {
            const task = new Task(1, 'Updated Task', 'Updated Description');
            mockDb.run.mockImplementation((_query: string, _params: any[], callback: Function) => {
                callback(null);
            });

            const result = await taskRepository.update(1, task);

            expect(mockDb.run).toHaveBeenCalledWith(
                'UPDATE tasks SET title = ?, description = ? WHERE id = ?',
                ['Updated Task', 'Updated Description', 1],
                expect.any(Function)
            );
            expect(result).toEqual(new Task(1, 'Updated Task', 'Updated Description'));
        });

        it('should throw an error if updating the task fails', async () => {
            const task = new Task(1, 'Updated Task', 'Updated Description');
            mockDb.run.mockImplementation((_query: string, _params: any[], callback: Function) => {
                callback(new Error('Failed to update task'));
            });

            await expect(taskRepository.update(1, task)).rejects.toThrow('Failed to update task');
        });
    });

    describe('delete', () => {
        it('should delete a task and return true', async () => {
            mockDb.run.mockImplementation((_query: string, _params: any[], callback: Function) => {
                callback(null);
            });

            const result = await taskRepository.delete(1);

            expect(mockDb.run).toHaveBeenCalledWith('DELETE FROM tasks WHERE id = ?', [1], expect.any(Function));
            expect(result).toBe(true);
        });

        it('should throw an error if deleting the task fails', async () => {
            mockDb.run.mockImplementation((_query: string, _params: any[], callback: Function) => {
                callback(new Error('Failed to delete task'));
            });

            await expect(taskRepository.delete(1)).rejects.toThrow('Failed to delete task');
        });
    });
});
