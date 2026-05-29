import mongoose, { Schema, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import type { IWorkspaceDocument } from '../types/index.js';

const workspaceMemberSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member'],
      default: 'member',
    },
  },
  { _id: false }
);

const workspaceSchema = new Schema<IWorkspaceDocument>(
  {
    name: {
      type: String,
      required: [true, 'Workspace name is required'],
      trim: true,
      maxlength: [100, 'Name must be at most 100 characters'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [500, 'Description must be at most 500 characters'],
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner ID is required'],
    },
    members: [workspaceMemberSchema],
    inviteCode: {
      type: String,
      unique: true,
      default: () => uuidv4().replace(/-/g, '').substring(0, 12),
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Indexes
workspaceSchema.index({ ownerId: 1 });
workspaceSchema.index({ 'members.userId': 1 });
workspaceSchema.index({ inviteCode: 1 }, { unique: true });

const Workspace: Model<IWorkspaceDocument> = mongoose.model<IWorkspaceDocument>(
  'Workspace',
  workspaceSchema
);

export default Workspace;
