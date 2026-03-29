import { Request } from 'express';
import { z } from 'zod';
import spacesService from '@/services/spaces.service';
import { createSpaceSchema } from '@/schemas/createSpace.schema';
import linksService from '@/services/links.service';
import Controller from '@/core/Controller';
import { verifyAuth } from '@/middlewares/verifyAuth';
import Response from '@/core/Response';
import RequestError from '@/core/RequestError';

export default class SpacesController extends Controller {
  constructor() {
    super();

    this.post('/', verifyAuth, this.createSpace);
    this.get('/', verifyAuth, this.getUserSpaces);
    this.get('/:slug', this.getSpaceBySlug);
    this.get('/:slug/links', this.getSpaceLinks);
  }

  public async createSpace(req: Request) {
    const userId = req.user!.id;
    const result = createSpaceSchema.safeParse(req.body);

    if (!result.success) {
      throw RequestError.badRequest(
        'Invalid request body',
        z.treeifyError(result.error)
      );
    }

    const space = await spacesService.createSpace(result.data, userId);

    return Response.created(space);
  }

  public async getUserSpaces(req: Request) {
    const userId = req.user!.id;
    const spaces = await spacesService.getUserSpaces(userId);

    return Response.ok(spaces);
  }

  public async getSpaceBySlug(req: Request<{ slug: string }>) {
    const { slug } = req.params;
    const space = await spacesService.getSpaceBySlug(slug);

    return Response.ok(space);
  }

  public async getSpaceLinks(req: Request<{ slug: string }>) {
    const { slug } = req.params;
    const space = await spacesService.getSpaceBySlug(slug);

    const links = await linksService.getSpaceLinks(space.id);
    return Response.ok(links);
  }
}
