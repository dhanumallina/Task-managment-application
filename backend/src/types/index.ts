import { Types, Document } from 'mongoose';
import { Request } from 'express';

// ─── User ────────────────────────────────────────────────────────────
export type UserRole = 'user' | 'admin';

export interface IUser {
  name: string;
  email: string;
  password: string;
  avatar: string;
  role: UserRole;
  workspaces: Types.ObjectId[];
  refreshToken: string;
  createdAt: Date;
}

export interface IUserDocument extends IUser, Document {}

export interface IUserSafe {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  workspaces: string[];
  createdAt: Date;
}

// ─── Task ────────────────────────────────────────────────────────────
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'archived';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ISubtask {
  _id?: Types.ObjectId;
  title: string;
  completed: boolean;
}

export interface ITask {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  labels: string[];
  category: string;
  notes: string;
  attachments: string[];
  subtasks: ISubtask[];
  createdBy: Types.ObjectId;
  assignedTo?: Types.ObjectId;
  workspaceId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITaskDocument extends ITask, Document {}

// ─── Workspace ───────────────────────────────────────────────────────
export type WorkspaceMemberRole = 'owner' | 'admin' | 'member';

export interface IWorkspaceMember {
  userId: Types.ObjectId;
  role: WorkspaceMemberRole;
}

export interface IWorkspace {
  name: string;
  description: string;
  ownerId: Types.ObjectId;
  members: IWorkspaceMember[];
  inviteCode: string;
  createdAt: Date;
}

export interface IWorkspaceDocument extends IWorkspace, Document {}

// ─── Comment ─────────────────────────────────────────────────────────
export interface IComment {
  taskId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
  createdAt: Date;
}

export interface ICommentDocument extends IComment, Document {}

// ─── Notification ────────────────────────────────────────────────────
export type NotificationType =
  | 'task_assigned'
  | 'task_updated'
  | 'due_date'
  | 'comment'
  | 'mention'
  | 'workspace_invite';

export interface INotification {
  userId: Types.ObjectId;
  type: NotificationType;
  message: string;
  referenceId?: Types.ObjectId;
  read: boolean;
  createdAt: Date;
}

export interface INotificationDocument extends INotification, Document {}

// ─── Auth ────────────────────────────────────────────────────────────
export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ─── Request Extensions ──────────────────────────────────────────────
export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

// ─── API Response ────────────────────────────────────────────────────
export interface ApiResponseBody<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown[];
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// ─── Socket ──────────────────────────────────────────────────────────
export interface SocketUser {
  userId: string;
  socketId: string;
  workspaces: string[];
}

export interface ServerToClientEvents {
  'task:created': (task: ITask & { _id: string }) => void;
  'task:updated': (task: ITask & { _id: string }) => void;
  'task:deleted': (data: { taskId: string; workspaceId: string }) => void;
  'task:moved': (data: { taskId: string; from: TaskStatus; to: TaskStatus }) => void;
  'comment:added': (comment: IComment & { _id: string }) => void;
  'notification:new': (notification: INotification & { _id: string }) => void;
  'user:online': (data: { userId: string }) => void;
  'user:offline': (data: { userId: string }) => void;
}

export interface ClientToServerEvents {
  'join:workspace': (workspaceId: string) => void;
  'leave:workspace': (workspaceId: string) => void;
}
