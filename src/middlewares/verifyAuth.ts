import { Request, Response, NextFunction } from 'express';
import authService from '@/services/auth.service';
import usersService from '@/services/users.service';

export async function verifyAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.session_token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const verificationResult = await authService.verifyToken(token);

  if (!verificationResult) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await usersService.getUserById(verificationResult.userId);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.user = user;

  next();
}
