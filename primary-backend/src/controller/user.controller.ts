
import type { Response, NextFunction } from 'express';
import type {AuthRequest} from "../types/auth.types.ts";
import {userService} from "../services/user.service";
import { AppError } from '../middleware/errorHandler';

export class UserController {
    async getCurrentUser(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError('Authentication required', 401);
            }

            const user = await userService.getUserById(req.user.userId);

            res.status(200).json({ user });
        } catch (error) {
            next(error);
        }
    }

    async getChildren(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            // if (!req.user || req.user.role !== 'PARENT') {
            //     throw new AppError('Only parents can view children', 403);
            // }

            //@ts-ignore

            const children = await userService.getChildrenByParent(req.user.userId);

            res.status(200).json({ children });
        } catch (error) {
            next(error);
        }
    }

    async getParent(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user || req.user.role !== 'CHILD') {
                throw new AppError('Only children can view their parent', 403);
            }

            const parent = await userService.getParent(req.user.userId);

            if (!parent) {
                throw new AppError('Parent not found', 404);
            }

            res.status(200).json({ parent });
        } catch (error) {
            next(error);
        }
    }
}

export const userController = new UserController();