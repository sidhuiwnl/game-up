import {Router} from "express";
import {taskController} from "../controller/task.controller";
import {authenticate,authorize} from "../middleware/middleware";
import express from "express";


const router = Router();

router.use(authenticate)

router.use((req, res, next) => {
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        express.json()(req, res, next);
    } else {
        next();
    }
});

// Get all tasks (different behavior for parent/child)
router.get('/', taskController.getTasks);


// Get specific task
router.get('/:taskId', taskController.getTaskById);



// Parent-only routes
router.post('/',authorize(["PARENT"]) ,taskController.createTask);
router.put('/:taskId',authorize(["PARENT"]),  taskController.updateTask);
router.delete('/:taskId',authorize(["PARENT"]),  taskController.deleteTask);
router.patch('/:taskId/review',authorize(["PARENT"]),  taskController.reviewTask);



// Child-only routes
router.post('/:taskId/submit',authorize(["CHILD"]),taskController.submitTask);

export default router;