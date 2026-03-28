import { Router } from 'express';
import SpacesController from '@/controllers/SpacesController';

const spacesRouter = Router();
const controller = new SpacesController();

controller.registerRoutes(spacesRouter);

export default spacesRouter;
