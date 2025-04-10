import express, {Router} from "express";
import {userController} from "../controller/user.controller";
import {authorize,authenticate} from "../middleware/middleware";

const router = Router();

router.use((req, res, next) => {
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        express.json()(req, res, next);
    } else {
        next();
    }
});

router.use(authenticate)

router.get("/me",userController.getCurrentUser);
router.get("/children",authorize(["PARENT"]),userController.getChildren);
router.get("/parent",authorize(["CHILD"]),userController.getParent);

export default router;
