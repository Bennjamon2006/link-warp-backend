import { Request, Response as ExpressResponse } from 'express';
import { z } from 'zod';
import spacesService from '@/services/spaces.service';
import { createSpaceSchema } from '@/schemas/createSpace.schema';
import isUniqueError from '@/helpers/isUniqueError';
import linksService from '@/services/links.service';
import Controller from '@/core/Controller';
import { verifyAuth } from '@/middlewares/verifyAuth';
import Response from '@/core/Response';

export default class SpacesController extends Controller {
  constructor() {
    super();

    this.post('/', verifyAuth, this.createSpace);
    this.get('/', verifyAuth, this.getUserSpaces);
    this.get('/:slug', this.getSpaceBySlug);
    this.get('/:slug/links', this.getSpaceLinks);
  }

  public async createSpace(req: Request, res: ExpressResponse) {
    try {
      const userId = req.user!.id;
      const result = createSpaceSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          error: 'Invalid request body',
          details: z.treeifyError(result.error),
        });
      }

      const space = await spacesService.createSpace(result.data, userId);

      return Response.created(space);
    } catch (error) {
      if (isUniqueError(error)) {
        return res
          .status(409)
          .json({ error: 'Space with this slug already exists' });
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async getUserSpaces(req: Request, res: ExpressResponse) {
    try {
      const userId = req.user!.id;
      const spaces = await spacesService.getUserSpaces(userId);

      return Response.ok(spaces);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async getSpaceBySlug(
    req: Request<{ slug: string }>,
    res: ExpressResponse
  ) {
    try {
      const { slug } = req.params;
      const space = await spacesService.getSpaceBySlug(slug);

      if (!space) {
        return res.status(404).json({ error: 'Space not found' });
      }

      return Response.ok(space);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });

      console.error(error);
    }
  }

  public async getSpaceLinks(
    req: Request<{ slug: string }>,
    res: ExpressResponse
  ) {
    try {
      const { slug } = req.params;
      const space = await spacesService.getSpaceBySlug(slug);

      if (!space) {
        return res.status(404).json({ error: 'Space not found' });
      }

      const links = await linksService.getSpaceLinks(space.id);
      return Response.ok(links);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });

      console.error(error);
    }
  }
}
