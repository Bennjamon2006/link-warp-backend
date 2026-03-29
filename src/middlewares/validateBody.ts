import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import RequestError from '@/core/RequestError';

export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details = z.flattenError(result.error).fieldErrors;

      return next(
        new RequestError('Invalid request body', 400, 'INVALID_BODY', details)
      );
    }

    req.body = result.data;
    next();
  };
};
