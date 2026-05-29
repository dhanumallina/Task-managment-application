import mongoose, { Schema, Model } from 'mongoose';
import type { INotificationDocument } from '../types/index.js';

const notificationSchema = new Schema<INotificationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    type: {
      type: String,
      enum: [
        'task_assigned',
        'task_updated',
        'due_date',
        'comment',
        'mention',
        'workspace_invite',
      ],
      required: [true, 'Notification type is required'],
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      maxlength: [500, 'Message must be at most 500 characters'],
    },
    referenceId: {
      type: Schema.Types.ObjectId,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Indexes
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, read: 1 });

const Notification: Model<INotificationDocument> = mongoose.model<INotificationDocument>(
  'Notification',
  notificationSchema
);

export default Notification;
