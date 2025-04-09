import type {Request,Response,NextFunction} from "express";
import type {Role} from "@prisma/client";
import type {AuthRequest,TokenPayload} from "../types/auth.types.ts";
import jwt from "jsonwebtoken";

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {

        const token = req.headers.authorization?.split(' ')[1];



        if (!token) {
             res.status(401).json({
                message: 'Authentication required'
            });
             return ;
        }


        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

        console.log("decoded",decoded);
        req.user = decoded;

        console.log("current user",req.user.userId);
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Invalid or expired token'
        });
        return;
    }
};

export const authorize = (roles : Role[]) =>{
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if(!req.user){
             res.status(401).json({
                message : "Authentication required"
            });
            return;
        }

        if(!roles.includes(req.user.role)){
             res.status(403).json({
                message: 'Access denied. Insufficient permissions'
            });
            return;
        }
        next();
    }

}