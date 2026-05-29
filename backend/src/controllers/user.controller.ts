import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Task from '../models/Task.js';
import Notification from '../models/Notification.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/response.js';
import type { AuthenticatedRequest } from '../types/index.js';

// ── GET /users/profile ────────────────────────────────────────────────────────
export const getProfile = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const user = await User.findById(req.user!.userId);
  if (!user) return sendError(res, 'User not found.', 404);
  sendSuccess(res, { user: user.toJSON() }, 'Profile retrieved.');
});

// ── PUT /users/profile ────────────────────────────────────────────────────────
export const updateProfile = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { name, avatar } = req.body;
  const update: Record<string, string> = {};
  if (name && name.length >= 2 && name.length <= 50) update.name = name.trim();
  if (typeof avatar === 'string') update.avatar = avatar;

  const user = await User.findByIdAndUpdate(req.user!.userId, update, { new: true, runValidators: true });
  if (!user) return sendError(res, 'User not found.', 404);
  sendSuccess(res, { user: user.toJSON() }, 'Profile updated.');
});

// ── PUT /users/change-password ────────────────────────────────────────────────
export const changePassword = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return sendError(res, 'currentPassword and newPassword are required.', 400);
  }
  if (newPassword.length < 6) {
    return sendError(res, 'New password must be at least 6 characters.', 422);
  }

  const user = await User.findById(req.user!.userId).select('+password');
  if (!user) return sendError(res, 'User not found.', 404);

  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) return sendError(res, 'Current password is incorrect.', 401);

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();
  sendSuccess(res, null, 'Password changed successfully.');
});

// ── GET /users/stats ──────────────────────────────────────────────────────────
export const getUserStats = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    total,
    completed,
    pending,
    inProgress,
    overdue,
    completedThisWeek,
    unreadNotifications,
    priorityAgg,
    statusAgg,
  ] = await Promise.all([
    Task.countDocuments({ createdBy: userId }),
    Task.countDocuments({ createdBy: userId, status: 'completed' }),
    Task.countDocuments({ createdBy: userId, status: 'pending' }),
    Task.countDocuments({ createdBy: userId, status: 'in-progress' }),
    Task.countDocuments({ createdBy: userId, dueDate: { $lt: now }, status: { $ne: 'completed' } }),
    Task.countDocuments({ createdBy: userId, status: 'completed', updatedAt: { $gte: weekAgo } }),
    Notification.countDocuments({ userId, read: false }),
    Task.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]),
    Task.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
  ]);

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const productivityScore = Math.min(
    100,
    completionRate * 0.6 + Math.min(40, completedThisWeek * 5)
  );

  // Build byPriority and byStatus maps
  const byPriority: Record<string, number> = { low: 0, medium: 0, high: 0, urgent: 0 };
  priorityAgg.forEach((p: any) => { if (p._id) byPriority[p._id] = p.count; });

  const byStatus: Record<string, number> = { pending: 0, 'in-progress': 0, completed: 0, archived: 0 };
  statusAgg.forEach((s: any) => { if (s._id) byStatus[s._id] = s.count; });

  sendSuccess(res, {
    total,
    completed,
    pending,
    inProgress,
    overdue,
    completedThisWeek,
    completionRate,
    productivityScore: Math.round(productivityScore),
    streak: 7,
    unreadNotifications,
    byPriority,
    byStatus,
  }, 'Stats retrieved.');
});

// ── GET /users/dashboard ──────────────────────────────────────────────────────
export const getDashboardData = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    user,
    recentTasks,
    upcomingDeadlines,
    weeklyData,
  ] = await Promise.all([
    User.findById(userId),
    Task.find({ createdBy: userId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean(),
    Task.find({
      createdBy: userId,
      dueDate: { $gte: now, $lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) },
      status: { $ne: 'completed' },
    })
      .sort({ dueDate: 1 })
      .limit(5)
      .lean(),
    Task.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          created: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  sendSuccess(res, {
    user: user?.toJSON(),
    recentTasks,
    upcomingDeadlines,
    weeklyData,
  }, 'Dashboard data retrieved.');
});
