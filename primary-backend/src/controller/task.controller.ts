
import type { Request, Response, NextFunction } from 'express';
import type {AuthRequest} from "../types/auth.types.ts";
import {taskService} from "../services/task.service";
import type {CreateTaskDto,UpdateTaskDto,CreateSubmissionDto} from "../types/task.types.ts";
import { AppError } from '../middleware/errorHandler';

export class TaskController {
    async createTask(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError('Authentication required', 401);
            }

            const taskData: CreateTaskDto = req.body;
            const task = await taskService.createTask(req.user.userId, taskData);

            res.status(201).json({
                message: 'Task created successfully',
                task
            });
        } catch (error) {
            next(error);
        }
    }

    async getTasks(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError('Authentication required', 401);
            }

            let tasks;
            if (req.user.role === 'PARENT') {
                tasks = await taskService.getTasksByParent(req.user.userId);
            } else {
                tasks = await taskService.getTasksByChild(req.user.userId);
            }

            res.status(200).json({ tasks });
        } catch (error) {
            next(error);
        }
    }

    async getTaskById(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError('Authentication required', 401);
            }

            const taskId = req.params.taskId;
            const task = await taskService.getTaskById(taskId);

            // Check if user has permission to view this task
            if (req.user.role === 'PARENT' && task.creatorId !== req.user.userId) {
                throw new AppError('You do not have permission to view this task', 403);
            } else if (req.user.role === 'CHILD' && task.assigneeId !== req.user.userId) {
                throw new AppError('You do not have permission to view this task', 403);
            }

            res.status(200).json({ task });
        } catch (error) {
            next(error);
        }
    }

    async updateTask(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user || req.user.role !== 'PARENT') {
                throw new AppError('Only parents can update tasks', 403);
            }

            const taskId = req.params.taskId;
            const updateData: UpdateTaskDto = req.body;

            const task = await taskService.updateTask(req.user.userId, taskId, updateData);

            res.status(200).json({
                message: 'Task updated successfully',
                task
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteTask(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user || req.user.role !== 'PARENT') {
                throw new AppError('Only parents can delete tasks', 403);
            }

            const taskId = req.params.taskId;

            await taskService.deleteTask(req.user.userId, taskId);

            res.status(200).json({
                message: 'Task deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    async submitTask(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user || req.user.role !== 'CHILD') {
                throw new AppError('Only children can submit tasks', 403);
            }

            const taskId = req.params.taskId;
            const submissionData: CreateSubmissionDto = req.body;

            const task = await taskService.submitTask(req.user.userId, taskId, submissionData);



            res.status(200).json({
                message: 'Task submitted successfully',
                task
            });
        } catch (error) {
            next(error);
        }
    }

    async reviewTask(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user || req.user.role !== 'PARENT') {
                throw new AppError('Only parents can review tasks', 403);
            }

            const taskId = req.params.taskId;

            const task = await taskService.reviewTask(req.user.userId, taskId);

            res.status(200).json({
                message: 'Task reviewed successfully',
                task
            });
        } catch (error) {
            next(error);
        }
    }
}

export const taskController = new TaskController();