import mongoose, { Schema, Model } from 'mongoose';
import type { ICommentDocument } from '../types/index.js';

const commentSchema = new Schema<ICommentDocument>(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: [true, 'Task ID is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      maxlength: [2000, 'Comment must be at most 2000 characters'],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Indexes
commentSchema.index({ taskId: 1, createdAt: -1 });
commentSchema.index({ userId: 1 });

const Comment: Model<ICommentDocument> = mongoose.model<ICommentDocument>(
  'Comment',
  commentSchema
);

export default Comment;
