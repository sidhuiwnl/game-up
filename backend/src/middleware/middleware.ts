import type {Request,Response,NextFunction} from "express";
import type {Role} from "@prisma/client";
import type {AuthRequest,TokenPayload} from "../types/auth.types.ts";
import jwt from "jsonwebtoken";

export const audenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).send("No token provided");
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET as string) as TokenPayload;
        //@ts-ignore
        req.user = decoded;
        next();


    }catch {
        return res.status(401).json({
            message: 'Invalid or expired token'
        });
    }
}

export const authorize = (roles : Role[]) =>{
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if(!req.user){
            return res.status(401).json({
                message : "Authentication required"
            });
        }

        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                message: 'Access denied. Insufficient permissions'
            });
        }
        next();
    }

}