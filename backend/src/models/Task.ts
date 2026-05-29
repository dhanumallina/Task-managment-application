import mongoose, { Schema, Model } from 'mongoose';
import type { ITaskDocument } from '../types/index.js';

const subtaskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Subtask title is required'],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const taskSchema = new Schema<ITaskDocument>(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [200, 'Title must be at most 200 characters'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [5000, 'Description must be at most 5000 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'archived'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
    },
    labels: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
    notes: {
      type: String,
      default: '',
      maxlength: [2000, 'Notes must be at most 2000 characters'],
    },
    attachments: [
      {
        type: String,
      },
    ],
    subtasks: [subtaskSchema],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task creator is required'],
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: [true, 'Workspace ID is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common query patterns
taskSchema.index({ workspaceId: 1, status: 1 });
taskSchema.index({ workspaceId: 1, priority: 1 });
taskSchema.index({ workspaceId: 1, createdAt: -1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ createdBy: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ category: 1 });
taskSchema.index({ title: 'text', description: 'text' });

const Task: Model<ITaskDocument> = mongoose.model<ITaskDocument>('Task', taskSchema);

export default Task;
