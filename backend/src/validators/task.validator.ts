import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must be at most 200 characters')
    .trim(),
  description: z.string().max(5000, 'Description too long').optional().default(''),
  status: z
    .enum(['pending', 'in-progress', 'completed', 'archived'])
    .optional()
    .default('pending'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().default('medium'),
  dueDate: z.string().optional().nullable(),
  labels: z.array(z.string().trim().max(30)).optional().default([]),
  category: z.string().trim().max(50).optional().default(''),
  notes: z.string().max(2000).optional().default(''),
});

export const updateTaskSchema = createTaskSchema.partial();

export const createSubtaskSchema = z.object({
  title: z.string().min(1).max(200).trim(),
});

export const taskQuerySchema = z.object({
  page:     z.coerce.number().int().positive().optional().default(1),
  limit:    z.coerce.number().int().min(1).max(100).optional().default(20),
  status:   z.enum(['pending', 'in-progress', 'completed', 'archived', 'all']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent', 'all']).optional(),
  search:   z.string().optional(),
  category: z.string().optional(),
  sortBy:   z.enum(['createdAt', 'updatedAt', 'dueDate', 'priority', 'title']).optional().default('createdAt'),
  sortOrder:z.enum(['asc', 'desc']).optional().default('desc'),
  overdue:  z.coerce.boolean().optional(),
});
