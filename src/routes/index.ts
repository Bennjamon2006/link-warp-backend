import { Router } from 'express';
import usersRouter from '@/routes/users.router';

const router = Router();

router.use('/users', usersRouter);

export default router;
