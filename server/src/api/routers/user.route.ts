import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { UserController } from "../controllers/user.controller.js";

export const UserRouter = Router()

UserRouter.get('/login', authMiddleware)
UserRouter.get('/all', UserController.getUsers)
UserRouter.post('/create', UserController.createUser)