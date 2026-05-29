export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

export type NotificationType =
  | "task_assigned"
  | "task_completed"
  | "task_due_soon"
  | "task_overdue"
  | "comment_added"
  | "member_joined"
  | "workspace_update";

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ProductivityData {
  date: string;
  completed: number;
  created: number;
}

