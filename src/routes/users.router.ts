import { Router } from 'express';
import UsersController from '@/controllers/UsersController';

const usersRouter = Router();
const controller = new UsersController();

controller.registerRoutes(usersRouter);

export default usersRouter;
