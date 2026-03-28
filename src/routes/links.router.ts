import { Router } from 'express';
import LinksController from '@/controllers/LinksController';

const linksRouter = Router();
const controller = new LinksController();

controller.registerRoutes(linksRouter);

export default linksRouter;
