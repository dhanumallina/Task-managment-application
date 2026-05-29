import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// ── Schemas ──────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters')
    .trim(),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please provide a valid email address')
    .trim()
    .toLowerCase(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters')
    .max(72, 'Password is too long')
    .regex(/(?=.*[a-zA-Z])(?=.*[0-9])/, 'Password must contain at least one letter and one number'),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please provide a valid email address')
    .trim()
    .toLowerCase(),
  password: z.string({ required_error: 'Password is required' }),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please provide a valid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string({ required_error: 'Reset token is required' }),
  newPassword: z
    .string({ required_error: 'New password is required' })
    .min(6, 'Password must be at least 6 characters')
    .regex(/(?=.*[a-zA-Z])(?=.*[0-9])/, 'Password must contain at least one letter and one number'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string({ required_error: 'Current password is required' }),
  newPassword: z
    .string({ required_error: 'New password is required' })
    .min(6, 'Password must be at least 6 characters'),
});

// ── Middleware factory ────────────────────────────────────────────────────────

export const validateBody =
  (schema: z.ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      res.status(422).json({ success: false, message: 'Validation failed', errors });
      return;
    }
    req.body = result.data;
    next();
  };
