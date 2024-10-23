import request from 'supertest';
import {TaskService} from "../../../src/application/services/TaskService";
import {Task} from "../../../src/domain/Task";
import app from "../../../src";


describe('TaskController', () => {
    const AUTH_TOKEN = 'mysecrettoken';

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /tasks', () => {
        it('should create a new task and return it', async () => {
            const newTask = new Task(1, 'Test Task', 'Test Description');
            jest.spyOn(TaskService.prototype, 'createTask').mockResolvedValue(newTask);

            const res = await request(app)
                .post('/tasks')
                .set('Authorization', AUTH_TOKEN)
                .send({ title: 'Test Task', description: 'Test Description' })
                .expect(201);

            expect(res.body).toEqual({
                id: 1,
                title: 'Test Task',
                description: 'Test Description'
            });
        });

        it('should return a 401 error if no valid token is provided', async () => {
            const res = await request(app)
                .post('/tasks')
                .send({ title: 'Test Task', description: 'Test Description' })
                .expect(401);

            expect(res.body).toEqual({
                message: 'Unauthorized: Invalid token',
            });
        });
    });

    describe('GET /tasks', () => {
        it('should retrieve all tasks', async () => {
            const tasks = [
                new Task(1, 'Task 1', 'Description 1'),
                new Task(2, 'Task 2', 'Description 2'),
            ];
            jest.spyOn(TaskService.prototype, 'getAllTasks').mockResolvedValue(tasks);

            const res = await request(app)
                .get('/tasks')
                .set('Authorization', AUTH_TOKEN)
                .expect(200);

            expect(res.body).toEqual(tasks.map(task => ({
                id: task.id,
                title: task.title,
                description: task.description
            })));
        });

        it('should return a 401 error if no valid token is provided', async () => {
            const res = await request(app)
                .get('/tasks')
                .expect(401);

            expect(res.body).toEqual({
                message: 'Unauthorized: Invalid token',
            });
        });
    });

    describe('PUT /tasks/:id', () => {
        it('should update an existing task and return it', async () => {
            const updatedTask = new Task(1, 'Updated Task', 'Updated Description');
            jest.spyOn(TaskService.prototype, 'updateTask').mockResolvedValue(updatedTask);

            const res = await request(app)
                .put('/tasks/1')
                .set('Authorization', AUTH_TOKEN)
                .send({ title: 'Updated Task', description: 'Updated Description' })
                .expect(200);

            expect(res.body).toEqual({
                id: 1,
                title: 'Updated Task',
                description: 'Updated Description'
            });
        });

        it('should return a 401 error if no valid token is provided', async () => {
            const res = await request(app)
                .put('/tasks/1')
                .send({ title: 'Updated Task', description: 'Updated Description' })
                .expect(401);

            expect(res.body).toEqual({
                message: 'Unauthorized: Invalid token',
            });
        });
    });

    describe('DELETE /tasks/:id', () => {
        it('should delete a task and return 204', async () => {
            jest.spyOn(TaskService.prototype, 'deleteTask').mockResolvedValue();

            await request(app)
                .delete('/tasks/1')
                .set('Authorization', AUTH_TOKEN)
                .expect(204);
        });

        it('should return a 401 error if no valid token is provided', async () => {
            const res = await request(app)
                .delete('/tasks/1')
                .expect(401);

            expect(res.body).toEqual({
                message: 'Unauthorized: Invalid token',
            });
        });
    });
});
