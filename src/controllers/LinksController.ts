import { Request } from 'express';
import { createLinkSchema } from '@/schemas/createLink.schema';
import linksService from '@/services/links.service';
import Controller from '@/core/Controller';
import { verifyAuth } from '@/middlewares/verifyAuth';
import Response from '@/core/Response';
import { validateBody } from '@/middlewares/validateBody';

export default class LinksController extends Controller {
  constructor() {
    super();

    this.post('/', verifyAuth, validateBody(createLinkSchema), this.createLink);
    this.get('/:space_slug/:link_slug', this.getLinkBySlug);
  }

  public async createLink(req: Request) {
    const userId = req.user!.id;

    const link = await linksService.createLink(req.body, userId);
    return Response.created(link);
  }

  async getLinkBySlug(req: Request<{ space_slug: string; link_slug: string }>) {
    const { space_slug, link_slug } = req.params;

    const link = await linksService.getLinkBySlug(link_slug, space_slug);

    return Response.ok(link);
  }
}
