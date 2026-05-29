import { Response } from 'express';
import type { ApiResponseBody } from '../types/index.js';

export class ApiResponse {
  static success<T>(
    res: Response,
    statusCode: number,
    message: string,
    data?: T
  ): Response {
    const body: ApiResponseBody<T> = {
      success: true,
      message,
      data,
    };
    return res.status(statusCode).json(body);
  }

  static error(
    res: Response,
    statusCode: number,
    message: string,
    errors?: unknown[]
  ): Response {
    const body: ApiResponseBody = {
      success: false,
      message,
      errors,
    };
    return res.status(statusCode).json(body);
  }

  static created<T>(res: Response, message: string, data?: T): Response {
    return ApiResponse.success(res, 201, message, data);
  }

  static ok<T>(res: Response, message: string, data?: T): Response {
    return ApiResponse.success(res, 200, message, data);
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  static badRequest(res: Response, message: string, errors?: unknown[]): Response {
    return ApiResponse.error(res, 400, message, errors);
  }

  static unauthorized(res: Response, message = 'Unauthorized'): Response {
    return ApiResponse.error(res, 401, message);
  }

  static forbidden(res: Response, message = 'Forbidden'): Response {
    return ApiResponse.error(res, 403, message);
  }

  static notFound(res: Response, message = 'Resource not found'): Response {
    return ApiResponse.error(res, 404, message);
  }

  static conflict(res: Response, message: string): Response {
    return ApiResponse.error(res, 409, message);
  }

  static internal(res: Response, message = 'Internal server error'): Response {
    return ApiResponse.error(res, 500, message);
  }
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
