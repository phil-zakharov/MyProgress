import { Router } from "express";
import { HealthController } from "../controllers/health.controller.js";

const HealthRouter = Router()

HealthRouter.get('/', HealthController.getHealth)

export { HealthRouter }