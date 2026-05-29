import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/tokens.js';
import type { AuthenticatedRequest } from '../types/index.js';
import { AppError } from './errorHandler.js';

export const authenticate = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    let token: string | undefined;

    // Check Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // Fallback to cookie
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new AppError('Authentication required. Please log in.', 401);
    }

    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err: any) {
    if (err.isOperational) {
      next(err);
    } else {
      next(new AppError('Invalid or expired token. Please log in again.', 401));
    }
  }
};

export const optionalAuth = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    let token: string | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }
    if (token) {
      req.user = verifyAccessToken(token);
    }
  } catch {
    // silently ignore — optional
  }
  next();
};

export const requireRole = (...roles: string[]) =>
  (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(new AppError('Forbidden: insufficient permissions.', 403));
      return;
    }
    next();
  };
