import { Request } from 'express';
import { createLinkSchema } from '@/schemas/createLink.schema';
import { z } from 'zod';
import linksService from '@/services/links.service';
import Controller from '@/core/Controller';
import { verifyAuth } from '@/middlewares/verifyAuth';
import Response from '@/core/Response';
import RequestError from '@/core/RequestError';

export default class LinksController extends Controller {
  constructor() {
    super();

    this.post('/', verifyAuth, this.createLink);
    this.get('/:space_slug/:link_slug', this.getLinkBySlug);
  }

  public async createLink(req: Request) {
    const userId = req.user!.id;
    const result = createLinkSchema.safeParse(req.body);

    if (!result.success) {
      throw RequestError.badRequest(
        'Invalid request body',
        z.treeifyError(result.error)
      );
    }

    const link = await linksService.createLink(result.data, userId);
    return Response.created(link);
  }

  async getLinkBySlug(req: Request<{ space_slug: string; link_slug: string }>) {
    const { space_slug, link_slug } = req.params;

    const link = await linksService.getLinkBySlug(link_slug, space_slug);

    return Response.ok(link);
  }
}
