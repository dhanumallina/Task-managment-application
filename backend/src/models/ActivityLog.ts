import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivityLog {
  userId: mongoose.Types.ObjectId;
  action: string;
  entityType: 'task' | 'user' | 'workspace' | 'comment';
  entityId: mongoose.Types.ObjectId;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface IActivityLogDocument extends IActivityLog, Document {}

const activityLogSchema = new Schema<IActivityLogDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    action: {
      type: String,
      required: [true, 'Action description is required'],
    },
    entityType: {
      type: String,
      enum: ['task', 'user', 'workspace', 'comment'],
      required: [true, 'Entity type is required'],
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Entity ID is required'],
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Indexing for analytics and chronological queries
activityLogSchema.index({ userId: 1, createdAt: -1 });

const ActivityLog: Model<IActivityLogDocument> = mongoose.model<IActivityLogDocument>(
  'ActivityLog',
  activityLogSchema
);

export default ActivityLog;
