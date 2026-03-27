import { Router } from 'express';
import usersRouter from '@/routes/users.router';
import authRouter from '@/routes/auth.router';
import spacesRouter from '@/routes/spaces.router';
import linksRouter from '@/routes/links.router';

const router = Router();

router.use('/users', usersRouter);
router.use('/auth', authRouter);
router.use('/spaces', spacesRouter);
router.use('/links', linksRouter);

export default router;
