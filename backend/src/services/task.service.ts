import type {Task} from "@prisma/client";
import {prisma} from "./prisma.service.ts";
import {AppError} from "../middleware/errorHandler.ts";
import type {CreateTaskDto,UpdateTaskDto,CreateSubmissionDto} from "../types/task.types.ts";

export class TaskService {
    async createTask(creatorId: string, taskData: CreateTaskDto): Promise<Task> {

        const creator = await prisma.user.findFirst({
            where: {  id : creatorId }
        });

        if (!creator || creator.role !== 'PARENT') {
            throw new AppError('Only parents can create tasks', 403);
        }


        const assignee = await prisma.user.findFirst({
            where: {
                id: taskData.assigneeId,
                parentId: creatorId
            }
        });

        if (!assignee) {
            throw new AppError('Assignee must be a child of the parent', 400);
        }


        return prisma.task.create({
            data: {
                name: taskData.name,
                description: taskData.description,
                dueDate: new Date(taskData.dueDate),
                xpReward: taskData.xpReward,
                creatorId,
                assigneeId: taskData.assigneeId,

            }
        });
    }
    async getTasksByParent(parentId: string): Promise<Task[]> {
        return prisma.task.findMany({
            where: {
                creatorId: parentId
            },
            include: {
                assignee: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                submission: true
            },
            orderBy: {
                dueDate: 'asc'
            }
        });
    }
    async getTasksByChild(childId: string): Promise<Task[]> {
        return prisma.task.findMany({
            where: {
                assigneeId: childId
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                submission: true
            },
            orderBy: {
                dueDate: 'asc'
            }
        });
    }
    async getTaskById(taskId: string): Promise<Task> {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                assignee: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                submission: true
            }
        });

        if (!task) {
            throw new AppError('Task not found', 404);
        }

        return task;
    }
    async updateTask(parentId: string, taskId: string, updateData: UpdateTaskDto): Promise<Task> {

        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
                creatorId: parentId
            }
        });

        if (!task) {
            throw new AppError('Task not found or you do not have permission to update it', 404);
        }


        return prisma.task.update({
            where: { id: taskId },
            data: updateData
        });
    }
    async deleteTask(parentId: string, taskId: string): Promise<void> {

        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
                creatorId: parentId
            }
        });

        if (!task) {
            throw new AppError('Task not found or you do not have permission to delete it', 404);
        }


        await prisma.submission.deleteMany({
            where: { taskId }
        });


        await prisma.task.delete({
            where: { id: taskId }
        });
    }
    async submitTask(childId: string, taskId: string, submissionData: CreateSubmissionDto): Promise<Task> {

        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
                assigneeId: childId
            }
        });

        if (!task) {
            throw new AppError('Task not found or you are not assigned to this task', 404);
        }

        if (task.status === 'SUBMITTED' || task.status === 'REVIEWED') {
            throw new AppError('This task has already been submitted', 400);
        }


        await prisma.submission.create({
            data: {
                content: submissionData.content,
                fileUrl: submissionData.fileUrl,
                taskId
            }
        });

        return prisma.task.update({
            where: {id: taskId},
            data: {
                status: 'SUBMITTED'
            },
            include: {
                submission: true
            }
        });
    }
    async reviewTask(parentId: string, taskId: string): Promise<Task> {

        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
                creatorId: parentId
            }
        });

        if (!task) {
            throw new AppError('Task not found or you do not have permission to review it', 404);
        }

        if (task.status !== 'SUBMITTED') {
            throw new AppError('This task has not been submitted yet', 400);
        }


        return prisma.task.update({
            where: { id: taskId },
            data: {
                status: 'REVIEWED'
            }
        });
    }

}

export const taskService = new TaskService();