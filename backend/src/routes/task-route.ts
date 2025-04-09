import {Router} from "express";
import {taskController} from "../controller/task.controller.ts";




const router = Router();



// Get all tasks (different behavior for parent/child)
router.get('/', taskController.getTasks);

// Get specific task
router.get('/:taskId', taskController.getTaskById);

// Parent-only routes
router.post('/', taskController.createTask);
router.put('/:taskId',  taskController.updateTask);
router.delete('/:taskId',  taskController.deleteTask);
router.patch('/:taskId/review',  taskController.reviewTask);

// Child-only routes
router.post('/:taskId/submit',  taskController.submitTask);

export default router;