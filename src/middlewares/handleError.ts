import { Request, Response, NextFunction } from 'express';
import RequestError from '@/core/RequestError';

export default function handleError(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  if (err instanceof RequestError) {
    return res.status(err.status).json(err.toJSON());
  }

  console.error(err);

  const requestError = RequestError.fromError(err);

  return res.status(requestError.status).json(requestError.toJSON());
}
