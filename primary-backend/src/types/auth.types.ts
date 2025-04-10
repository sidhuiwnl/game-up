import type {Role} from "@prisma/client";
import type {Request} from "express";

export interface  TokenPayload {
    userId: string;
    email: string;
    role: Role;
}

export interface AuthRequest extends Request {
    user? : TokenPayload;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    name: string;
    role: Role;
    parentId?: string;
}