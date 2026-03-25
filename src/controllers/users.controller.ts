import { Request, Response } from 'express';
import usersService from '@/services/users.service';
import { createUserSchema } from '@/schemas/createUser.schema';
import z from 'zod';

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
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export default {
  createUser,
};
