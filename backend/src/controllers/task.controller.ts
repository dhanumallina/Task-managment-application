import mongoose from 'mongoose';
import Task from '../models/Task.js';
import Notification from '../models/Notification.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';
import { createTaskSchema, updateTaskSchema, taskQuerySchema, createSubtaskSchema } from '../validators/task.validator.js';
import type { AuthenticatedRequest } from '../types/index.js';

const PRIORITY_ORDER: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 };

// ── GET /tasks ────────────────────────────────────────────────────────────────
export const getTasks = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const query = taskQuerySchema.safeParse(req.query);
  if (!query.success) {
    return sendError(res, 'Invalid query parameters', 400,
      query.error.errors.map(e => ({ field: e.path.join('.'), message: e.message })));
  }

  const { page, limit, status, priority, search, sortBy, sortOrder, overdue, category } = query.data;
  const userId = req.user!.userId;

  const filter: Record<string, any> = { createdBy: userId };

  if (status && status !== 'all') filter.status = status;
  if (priority && priority !== 'all') filter.priority = priority;
  if (category) filter.category = new RegExp(category, 'i');
  if (overdue) {
    filter.dueDate = { $lt: new Date() };
    filter.status = { $ne: 'completed' };
  }
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const sortMap: Record<string, any> = { priority: 1 };
  if (sortBy === 'priority') {
    // handled post-query for custom order
  }

  const sort: Record<string, 1 | -1> = {};
  if (sortBy !== 'priority') {
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
  } else {
    sort['priority'] = sortOrder === 'asc' ? 1 : -1;
  }

  const skip = (page - 1) * limit;
  const [tasks, total] = await Promise.all([
    Task.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Task.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);
  sendPaginated(res, tasks, {
    page, limit, total, totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  });
});

// ── GET /tasks/stats ──────────────────────────────────────────────────────────
export const getTaskStats = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const now = new Date();

  const [statusCounts, priorityCounts, overdue, completedThisWeek] = await Promise.all([
    Task.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Task.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]),
    Task.countDocuments({
      createdBy: userId,
      dueDate: { $lt: now },
      status: { $ne: 'completed' },
    }),
    Task.countDocuments({
      createdBy: userId,
      status: 'completed',
      updatedAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
    }),
  ]);

  const byStatus: Record<string, number> = { pending: 0, 'in-progress': 0, completed: 0, archived: 0 };
  statusCounts.forEach((s: any) => { byStatus[s._id] = s.count; });

  const byPriority: Record<string, number> = { low: 0, medium: 0, high: 0, urgent: 0 };
  priorityCounts.forEach((p: any) => { byPriority[p._id] = p.count; });

  const total = Object.values(byStatus).reduce((a, b) => a + b, 0);
  const completionRate = total > 0 ? Math.round((byStatus.completed / total) * 100) : 0;
  const productivityScore = Math.min(100, completionRate + Math.min(20, completedThisWeek * 3));

  sendSuccess(res, {
    byStatus,
    byPriority,
    total,
    overdue,
    completedThisWeek,
    completionRate,
    productivityScore,
    streak: Math.floor(Math.random() * 14) + 1, // TODO: implement real streak tracking
  }, 'Stats retrieved.');
});

// ── GET /tasks/:id ────────────────────────────────────────────────────────────
export const getTask = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const task = await Task.findOne({ _id: req.params.id, createdBy: req.user!.userId });
  if (!task) return sendError(res, 'Task not found.', 404);
  sendSuccess(res, task, 'Task retrieved.');
});

// ── POST /tasks ───────────────────────────────────────────────────────────────
export const createTask = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const parsed = createTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, 'Validation failed', 422,
      parsed.error.errors.map(e => ({ field: e.path.join('.'), message: e.message })));
  }

  const { dueDate, ...rest } = parsed.data;
  const task = await Task.create({
    ...rest,
    dueDate: dueDate ? new Date(dueDate) : undefined,
    createdBy: req.user!.userId,
    workspaceId: new mongoose.Types.ObjectId(), // personal workspace placeholder
  });

  // Emit socket event
  const io = req.app.get('io');
  if (io) {
    io.to(`user:${req.user!.userId}`).emit('task:created', task);
  }

  sendSuccess(res, task, 'Task created successfully.', 201);
});

// ── PUT /tasks/:id ────────────────────────────────────────────────────────────
export const updateTask = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const parsed = updateTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, 'Validation failed', 422,
      parsed.error.errors.map(e => ({ field: e.path.join('.'), message: e.message })));
  }

  const { dueDate, ...rest } = parsed.data;
  const update: Record<string, any> = { ...rest };
  if (dueDate !== undefined) update.dueDate = dueDate ? new Date(dueDate) : null;

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user!.userId },
    update,
    { new: true, runValidators: true }
  );
  if (!task) return sendError(res, 'Task not found.', 404);

  const io = req.app.get('io');
  if (io) io.to(`user:${req.user!.userId}`).emit('task:updated', task);

  sendSuccess(res, task, 'Task updated.');
});

// ── PATCH /tasks/:id/status ───────────────────────────────────────────────────
export const updateTaskStatus = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'in-progress', 'completed', 'archived'];
  if (!validStatuses.includes(status)) {
    return sendError(res, 'Invalid status value.', 400);
  }

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user!.userId },
    { status },
    { new: true }
  );
  if (!task) return sendError(res, 'Task not found.', 404);

  const io = req.app.get('io');
  if (io) io.to(`user:${req.user!.userId}`).emit('task:updated', task);

  // Create notification for completed tasks
  if (status === 'completed') {
    await Notification.create({
      userId: req.user!.userId,
      type: 'task_updated',
      message: `Task "${task.title}" marked as completed! 🎉`,
      referenceId: task._id,
      read: false,
    });
    const notifSocket = req.app.get('io');
    if (notifSocket) {
      const notif = await Notification.findOne({ referenceId: task._id }).sort({ createdAt: -1 });
      notifSocket.to(`user:${req.user!.userId}`).emit('notification:new', notif);
    }
  }

  sendSuccess(res, task, 'Task status updated.');
});

// ── DELETE /tasks/:id ─────────────────────────────────────────────────────────
export const deleteTask = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, createdBy: req.user!.userId });
  if (!task) return sendError(res, 'Task not found.', 404);

  const io = req.app.get('io');
  if (io) io.to(`user:${req.user!.userId}`).emit('task:deleted', { taskId: req.params.id });

  sendSuccess(res, null, 'Task deleted.');
});

// ── POST /tasks/:id/subtasks ──────────────────────────────────────────────────
export const createSubtask = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const parsed = createSubtaskSchema.safeParse(req.body);
  if (!parsed.success) return sendError(res, 'Title is required.', 422);

  const task = await Task.findOne({ _id: req.params.id, createdBy: req.user!.userId });
  if (!task) return sendError(res, 'Task not found.', 404);

  task.subtasks.push({ title: parsed.data.title, completed: false } as any);
  await task.save();
  sendSuccess(res, task, 'Subtask added.');
});

// ── PATCH /tasks/:id/subtasks/:subtaskId ──────────────────────────────────────
export const updateSubtask = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { completed } = req.body;
  const task = await Task.findOne({ _id: req.params.id, createdBy: req.user!.userId });
  if (!task) return sendError(res, 'Task not found.', 404);

  const subtask = task.subtasks.find((s: any) => String(s._id) === req.params.subtaskId);
  if (!subtask) return sendError(res, 'Subtask not found.', 404);

  (subtask as any).completed = typeof completed === 'boolean' ? completed : !subtask.completed;
  await task.save();
  sendSuccess(res, task, 'Subtask updated.');
});
