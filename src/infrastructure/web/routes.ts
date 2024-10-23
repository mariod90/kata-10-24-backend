import { Router } from 'express';
import { TaskController } from './TaskController';
import { SQLiteTaskRepository } from '../persistence/SQLiteTaskRepository';
import { TaskService } from '../../application/services/TaskService';
import { authMiddleware } from './middleware/authMiddleware';

const router = Router();
const taskRepository = new SQLiteTaskRepository();
const taskService = new TaskService(taskRepository);
const taskController = new TaskController(taskService);

router.use(authMiddleware);

router.post('/', taskController.createTask.bind(taskController));
router.get('/', taskController.getAllTasks.bind(taskController));
router.put('/:id', taskController.updateTask.bind(taskController));
router.delete('/:id', taskController.deleteTask.bind(taskController));

export default router
