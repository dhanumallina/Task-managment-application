export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
  preferences: UserPreferences;
}

export type UserRole = "admin" | "member" | "viewer";

export interface UserPreferences {
  theme: "dark" | "light" | "system";
  notifications: NotificationPreferences;
  defaultView: "board" | "list" | "calendar";
  language: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  taskAssigned: boolean;
  taskCompleted: boolean;
  taskDueSoon: boolean;
  commentAdded: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  avatar?: string;
  preferences?: Partial<UserPreferences>;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface TeamMember extends User {
  tasksCount: number;
  completedTasksCount: number;
  joinedAt: string;
}

