import { Router } from 'express';
import usersController from '@/controllers/users.controller';
import { verifyAuth } from '@/middlewares/verifyAuth';

const usersRouter = Router();

usersRouter.get('/me', verifyAuth, usersController.getProfile);
usersRouter.post('/', usersController.createUser);

export default usersRouter;
