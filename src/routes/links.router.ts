import { Router } from 'express';
import linksController from '@/controllers/links.controller';
import { verifyAuth } from '@/middlewares/verifyAuth';

const router = Router();

router.post('/', verifyAuth, linksController.createLink);

export default router;
