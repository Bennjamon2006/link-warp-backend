import { Request, Response as ExpressResponse } from 'express';
import { z } from 'zod';
import Controller from '@/core/Controller';
import authService from '@/services/auth.service';
import { loginSchema } from '@/schemas/login.schema';
import config from '@/config';
import Response from '@/core/Response';

export default class AuthController extends Controller {
  constructor() {
    super();
    this.post('/login', this.login);
    this.post('/logout', this.logout);
  }

  public async login(req: Request, res: ExpressResponse) {
    const parseResult = loginSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Invalid request body',
        details: z.treeifyError(parseResult.error),
      });
    }

    const { email, password } = parseResult.data;

    try {
      const token = await authService.login({ email, password });

      return Response.ok({ message: 'Login successful' }).setCookie(
        'session_token',
        token,
        {
          httpOnly: true,
          secure: config.runtime.isProduction,
          sameSite: 'lax',
        }
      );
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid credentials') {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      console.error('Error during login:', error);

      res.status(500).json({ error: 'Internal server error' });
    }
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
