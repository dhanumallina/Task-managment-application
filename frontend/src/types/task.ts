export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "todo" | "in_progress" | "completed";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  author: TaskUser;
  createdAt: string;
  updatedAt: string;
}

export interface TaskUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  assignee?: TaskUser;
  creator: TaskUser;
  tags: string[];
  subtasks: Subtask[];
  comments: Comment[];
  workspaceId: string;
  completedAt?: string;
  estimatedHours?: number;
  attachments?: string[];
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  search?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  tags?: string[];
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  assigneeId?: string;
  tags?: string[];
  subtasks?: { title: string }[];
  workspaceId: string;
  estimatedHours?: number;
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {
  id: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  overdue: number;
  completionRate: number;
}

export interface ActivityItem {
  id: string;
  type: "task_created" | "task_updated" | "task_completed" | "task_assigned" | "comment_added" | "subtask_completed";
  description: string;
  user: TaskUser;
  taskId?: string;
  taskTitle?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

