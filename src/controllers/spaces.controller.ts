import { Request, Response } from 'express';
import spacesService from '@/services/spaces.service';
import { createSpaceSchema } from '@/schemas/createSpace.schema';
import z from 'zod';
import isUniqueError from '@/helpers/isUniqueError';

async function createSpace(req: Request, res: Response) {
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
    res.status(201).json(space);
  } catch (error) {
    if (isUniqueError(error)) {
      return res
        .status(409)
        .json({ error: 'Space with this slug already exists' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getUserSpaces(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const spaces = await spacesService.getUserSpaces(userId);
    res.json(spaces);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });

    console.error(error);
  }
}

async function getSpaceBySlug(req: Request<{ slug: string }>, res: Response) {
  try {
    const { slug } = req.params;
    const space = await spacesService.getSpaceBySlug(slug);

    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }

    res.json(space);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });

    console.error(error);
  }
}

export default {
  createSpace,
  getUserSpaces,
  getSpaceBySlug,
};
