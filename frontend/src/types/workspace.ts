export interface Workspace {
  id: string;
  name: string;
  description?: string;
  slug: string;
  ownerId: string;
  members: WorkspaceMember[];
  createdAt: string;
  updatedAt: string;
  icon?: string;
  color?: string;
  settings: WorkspaceSettings;
}

export interface WorkspaceMember {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  role: WorkspaceRole;
  joinedAt: string;
}

export type WorkspaceRole = "owner" | "admin" | "member" | "viewer";

export interface WorkspaceSettings {
  defaultTaskPriority: string;
  allowGuestAccess: boolean;
  taskCategories: string[];
}

export interface CreateWorkspacePayload {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface InviteMemberPayload {
  email: string;
  role: WorkspaceRole;
}

