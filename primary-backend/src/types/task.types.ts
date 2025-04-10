import type {TaskStatus} from "@prisma/client";

export interface CreateTaskDto {
    name: string;
    description: string;
    dueDate: Date;
    xpReward: number;
    assigneeId: string;
}

export interface UpdateTaskDto {
    name?: string;
    description?: string;
    dueDate?: Date;
    xpReward?: number;
    status?: TaskStatus;
    assigneeId?: string;
}

export interface CreateSubmissionDto {
    content?: string;
    fileUrl?: string;
    completed? : "COMPLETED";
}