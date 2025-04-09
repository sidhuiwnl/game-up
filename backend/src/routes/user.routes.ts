import {Router} from "express";
import {userController} from "../controller/user.controller.ts";
import {authenticate, authorize} from "../middleware/middleware.ts";

const router = Router();

router.use(authenticate)

router.get("/me",userController.getCurrentUser);
router.get("/children",authorize(["PARENT"]),userController.getChildren);
router.get("/parent",authorize(["CHILD"]),userController.getParent);

export default router;

