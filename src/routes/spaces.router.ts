import { Router } from 'express';
import spacesController from '@/controllers/spaces.controller';
import { verifyAuth } from '@/middlewares/verifyAuth';

const router = Router();

router.post('/', verifyAuth, spacesController.createSpace);
router.get('/', verifyAuth, spacesController.getUserSpaces);
router.get('/:slug', spacesController.getSpaceBySlug);
router.get('/:slug/links', spacesController.getSpaceLinks);

export default router;
