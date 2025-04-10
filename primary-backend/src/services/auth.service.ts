import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import type {User} from "@prisma/client";
import type {TokenPayload,LoginDto,RegisterDto} from "../types/auth.types.ts";
import {AppError} from "../middleware/errorHandler";
import {prisma} from "./prisma.service";

export class AuthService {
    async register(userData : RegisterDto) : Promise<User>{
        const existingUser = await prisma.user.findUnique({
            where : {
                email : userData.email,
            }
        })

        if(existingUser){
            throw new AppError("Email aldready in use",400)
        }

        if(userData.role === "CHILD" && userData.parentId){
            const parent = await prisma.user.findUnique({
                where : {
                    id: userData.parentId
                }
            })
            if(!parent || parent.role !== "PARENT"){
                throw new AppError('Parent not found', 404);
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword  = await bcrypt.hash(userData.password, salt);

        const user = await prisma.user.create({
            data : {
                email : userData.email,
                password: hashedPassword,
                name: userData.name,
                role: userData.role,
                parentId: userData.parentId
            }
        })

        const { password,...userWithoutPassword } = user
        return userWithoutPassword as User;


    }

    async login(loginData : LoginDto) : Promise<{ user : Omit<User, 'password'>,token : string}>{
        const user = await prisma.user.findUnique({
            where : {
                email : loginData.email,
            }
        })
        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }
        const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
        if (!isPasswordValid) {
            throw new AppError('Invalid credentials', 401);
        }
        const tokenPayload: TokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role
        };

        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET!,

        );

        const { password, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            token
        };
    }
}

export const authService = new AuthService();