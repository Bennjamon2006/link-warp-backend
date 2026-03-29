import { Request, Response as ExpressResponse } from 'express';
import { z } from 'zod';
import usersService from '@/services/users.service';
import { createUserSchema } from '@/schemas/createUser.schema';
import isUniqueError from '@/helpers/isUniqueError';
import mapUser from '@/mappers/user.mapper';
import Controller from '@/core/Controller';
import { verifyAuth } from '@/middlewares/verifyAuth';
import Response from '@/core/Response';

export default class UsersController extends Controller {
  constructor() {
    super();

    this.post('/', this.createUser);
    this.get('/me', verifyAuth, this.getProfile);
  }

  public async createUser(req: Request, res: ExpressResponse) {
    const parseResult = createUserSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Invalid request body',
        details: z.treeifyError(parseResult.error),
      });
    }

    const { name, email, password } = parseResult.data;

    try {
      const result = await usersService.createUser({ name, email, password });

      return Response.created(result);
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

  public async getProfile(req: Request) {
    const user = req.user!;

    return Response.ok(mapUser(user));
  }
}
