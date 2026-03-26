import { Router } from 'express';
import usersRouter from '@/routes/users.router';
import authRouter from '@/routes/auth.router';

const router = Router();

router.use('/users', usersRouter);
router.use('/auth', authRouter);

export default router;
