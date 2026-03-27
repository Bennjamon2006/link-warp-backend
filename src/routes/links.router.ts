import { Router } from 'express';
import linksController from '@/controllers/links.controller';
import { verifyAuth } from '@/middlewares/verifyAuth';

const router = Router();

router.post('/', verifyAuth, linksController.createLink);
router.get('/:space_slug/:link_slug', linksController.getLinkBySlug);

export default router;
