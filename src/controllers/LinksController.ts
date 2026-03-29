import { Request, Response as ExpressResponse } from 'express';
import { createLinkSchema } from '@/schemas/createLink.schema';
import { z } from 'zod';
import isUniqueError from '@/helpers/isUniqueError';
import linksService from '@/services/links.service';
import Controller from '@/core/Controller';
import { verifyAuth } from '@/middlewares/verifyAuth';
import Response from '@/core/Response';

export default class LinksController extends Controller {
  constructor() {
    super();

    this.post('/', verifyAuth, this.createLink);
    this.get('/:space_slug/:link_slug', this.getLinkBySlug);
  }

  public async createLink(req: Request, res: ExpressResponse) {
    try {
      const userId = req.user!.id;
      const result = createLinkSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          error: 'Invalid request body',
          details: z.treeifyError(result.error),
        });
      }

      const link = await linksService.createLink(result.data, userId);
      return Response.created(link);
    } catch (error) {
      if (error instanceof Error && error.message === 'Unauthorized') {
        return res.status(403).json({
          error: 'You do not have permission to add links to this space',
        });
      }

      if (isUniqueError(error)) {
        return res
          .status(409)
          .json({ error: 'Link with this slug already exists in this space' });
      }

      console.error('Error creating link:', error);

      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getLinkBySlug(
    req: Request<{ space_slug: string; link_slug: string }>,
    res: ExpressResponse
  ) {
    try {
      const { space_slug, link_slug } = req.params;

      const link = await linksService.getLinkBySlug(link_slug, space_slug);

      if (!link) {
        return res.status(404).json({ error: 'Link not found' });
      }

      return Response.ok(link);
    } catch (error) {
      console.error('Error fetching link:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
