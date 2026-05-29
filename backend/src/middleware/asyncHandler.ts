import { Request, Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../types/index.js';

type AsyncFn = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler = (fn: AsyncFn) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as AuthenticatedRequest, res, next)).catch(next);
  };
};
