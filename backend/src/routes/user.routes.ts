import {Router} from "express";
import {userController} from "../controller/user.controller.ts";

const router = Router();

router.get("/me",userController.getCurrentUser);
router.get("/children",userController.getChildren);
router.get("/parent",userController.getParent);

export default router;

