import type {Request,Response,NextFunction} from "express";
import {authService} from "../services/auth.service.ts";
import type {LoginDto,RegisterDto} from "../types/auth.types.ts";


export class AuthController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const userData: RegisterDto = req.body;
            const user = await authService.register(userData);

            res.status(200).json({
                message: 'User registered successfully',
                user
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const loginData: LoginDto = req.body;
            const {user, token} = await authService.login(loginData);




            res.status(200).json({
                message: 'Login successful',
                user,
                token
            });
        } catch (error) {
            next(error);
        }
    }
}

export const authController = new AuthController();