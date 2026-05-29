import Notification from '../models/Notification.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';
import type { AuthenticatedRequest } from '../types/index.js';

// ── GET /notifications ────────────────────────────────────────────────────────
export const getNotifications = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const page  = Math.max(1, parseInt(String(req.query.page  ?? '1')));
  const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit ?? '20'))));
  const skip  = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    Notification.find({ userId: req.user!.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments({ userId: req.user!.userId }),
  ]);

  const totalPages = Math.ceil(total / limit);
  sendPaginated(res, notifications, {
    page, limit, total, totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  });
});

// ── GET /notifications/unread-count ──────────────────────────────────────────
export const getUnreadCount = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const count = await Notification.countDocuments({ userId: req.user!.userId, read: false });
  sendSuccess(res, { count }, 'Unread count retrieved.');
});

// ── PATCH /notifications/:id/read ────────────────────────────────────────────
export const markAsRead = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user!.userId },
    { read: true },
    { new: true }
  );
  if (!notification) return sendError(res, 'Notification not found.', 404);
  sendSuccess(res, notification, 'Marked as read.');
});

// ── PATCH /notifications/mark-all-read ───────────────────────────────────────
export const markAllAsRead = asyncHandler(async (req: AuthenticatedRequest, res) => {
  await Notification.updateMany({ userId: req.user!.userId, read: false }, { read: true });
  sendSuccess(res, null, 'All notifications marked as read.');
});

// ── DELETE /notifications/:id ─────────────────────────────────────────────────
export const deleteNotification = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    userId: req.user!.userId,
  });
  if (!notification) return sendError(res, 'Notification not found.', 404);
  sendSuccess(res, null, 'Notification deleted.');
});
