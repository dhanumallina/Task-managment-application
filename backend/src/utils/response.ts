import { Response } from 'express';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200
): void => {
  res.status(statusCode).json({ success: true, message, data });
};

export const sendError = (
  res: Response,
  message = 'Internal Server Error',
  statusCode = 500,
  errors?: unknown[]
): void => {
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  },
  message = 'Success'
): void => {
  res.status(200).json({ success: true, message, data, pagination });
};

export const setRefreshTokenCookie = (res: Response, token: string): void => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
};

export const clearRefreshTokenCookie = (res: Response): void => {
  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict', path: '/' });
};
