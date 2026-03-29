import { Request } from 'express';
import Controller from '@/core/Controller';
import authService from '@/services/auth.service';
import { loginSchema } from '@/schemas/login.schema';
import config from '@/config';
import Response from '@/core/Response';
import { validateBody } from '@/middlewares/validateBody';

export default class AuthController extends Controller {
  constructor() {
    super();
    this.post('/login', validateBody(loginSchema), this.login);
    this.post('/logout', this.logout);
  }

  public async login(req: Request) {
    const token = await authService.login(req.body);

    return Response.ok({ message: 'Login successful' }).setCookie(
      'session_token',
      token,
      {
        httpOnly: true,
        secure: config.runtime.isProduction,
        sameSite: 'lax',
      }
    );
  }

  public async logout() {
    return Response.ok({ message: 'Logout successful' }).clearCookie(
      'session_token',
      {
        httpOnly: true,
        secure: config.runtime.isProduction,
        sameSite: 'lax',
      }
    );
  }
}
