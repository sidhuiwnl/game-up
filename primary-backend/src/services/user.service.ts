import type {User} from "@prisma/client";
import {prisma} from "./prisma.service";
import {AppError} from "../middleware/errorHandler";

export class UserService {
    async getUserById(userId: string): Promise<Omit<User, 'password'>> {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }


        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async getChildrenByParent(parentId: string): Promise<Omit<User, 'password'>[]> {
        const children = await prisma.user.findMany({
            where: {
                parentId,
                role: 'CHILD'
            }
        });


        return children.map(child => {
            const { password, ...childWithoutPassword } = child;
            return childWithoutPassword;
        });
    }
    async getParent(childId: string): Promise<Omit<User, 'password'> | null> {
        const child = await prisma.user.findUnique({
            where: { id: childId },
            include: {
                parent: true
            }
        });

        if (!child || !child.parent) {
            return null;
        }


        const { password, ...parentWithoutPassword } = child.parent;
        return parentWithoutPassword;
    }

}

export const userService = new UserService();