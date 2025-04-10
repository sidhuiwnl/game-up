import express, {Router} from "express";
import {authController} from "../controller/auth.controller";

const router = Router();

router.use((req, res, next) => {
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        express.json()(req, res, next);
    } else {
        next();
    }
});

router.post("/register", authController.register);
router.post("/login", authController.login);

export default router;

