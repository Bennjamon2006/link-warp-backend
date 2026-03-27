import { Router } from 'express';
import spacesController from '@/controllers/spaces.controller';
import { verifyAuth } from '@/middlewares/verifyAuth';

const router = Router();

router.post('/', verifyAuth, spacesController.createSpace);

export default router;
