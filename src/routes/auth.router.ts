import { Router } from 'express';
import AuthController from '@/controllers/AuthController';

const authRouter = Router();
const authController = new AuthController();

authController.registerRoutes(authRouter);

export default authRouter;
