import { Request, Response } from 'express';
import z from 'zod';

import usersService from '@/services/users.service';
import { createUserSchema } from '@/schemas/createUser.schema';
import isUniqueError from '@/helpers/isUniqueError';
import mapUser from '@/mappers/user.mapper';

async function createUser(req: Request, res: Response) {
  const parseResult = createUserSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid request body',
      details: z.treeifyError(parseResult.error),
    });
  }

  const { name, email, password } = parseResult.data;

  try {
    const user = await usersService.createUser({ name, email, password });
    res.status(201).json(user);
  } catch (error) {
    if (isUniqueError(error)) {
      return res
        .status(409)
        .json({ error: 'User with this email already exists' });
    }

    console.error('Error creating user:', error);

    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getProfile(req: Request, res: Response) {
  const user = req.user!;

  res.json(mapUser(user));
}

export default {
  createUser,
  getProfile,
};
