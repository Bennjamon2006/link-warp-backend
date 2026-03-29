import { Request } from 'express';
import usersService from '@/services/users.service';
import { createUserSchema } from '@/schemas/createUser.schema';
import mapUser from '@/mappers/user.mapper';
import Controller from '@/core/Controller';
import { verifyAuth } from '@/middlewares/verifyAuth';
import Response from '@/core/Response';
import { validateBody } from '@/middlewares/validateBody';

export default class UsersController extends Controller {
  constructor() {
    super();

    this.post('/', validateBody(createUserSchema), this.createUser);
    this.get('/me', verifyAuth, this.getProfile);
  }

  public async createUser(req: Request) {
    const result = await usersService.createUser(req.body);

    return Response.created(result);
  }

  public async getProfile(req: Request) {
    const user = req.user!;

    return Response.ok(mapUser(user));
  }
}
