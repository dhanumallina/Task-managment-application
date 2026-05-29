import api from './api';
import type { Task, CreateTaskPayload, UpdateTaskPayload, TaskFilters } from '@/types/task';

export interface PaginatedTasks {
  tasks: Task[];
  total: number;
  page: number;
  totalPages: number;
}

export const taskService = {
  async getTasks(filters?: TaskFilters): Promise<PaginatedTasks> {
    const res = await api.get('/tasks', { params: filters });
    return res.data.data;
  },

  async getTask(id: string): Promise<Task> {
    const res = await api.get(`/tasks/${id}`);
    return res.data.data.task;
  },

  async createTask(data: CreateTaskPayload): Promise<Task> {
    const res = await api.post('/tasks', data);
    return res.data.data.task;
  },

  async updateTask(id: string, data: UpdateTaskPayload): Promise<Task> {
    const res = await api.put(`/tasks/${id}`, data);
    return res.data.data.task;
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  async updateStatus(id: string, status: Task['status']): Promise<Task> {
    const res = await api.patch(`/tasks/${id}/status`, { status });
    return res.data.data.task;
  },

  async addSubtask(taskId: string, title: string): Promise<Task> {
    const res = await api.post(`/tasks/${taskId}/subtasks`, { title });
    return res.data.data.task;
  },

  async toggleSubtask(taskId: string, subtaskId: string): Promise<Task> {
    const res = await api.patch(`/tasks/${taskId}/subtasks/${subtaskId}`);
    return res.data.data.task;
  },

  async getTaskComments(taskId: string) {
    const res = await api.get(`/tasks/${taskId}/comments`);
    return res.data.data.comments;
  },

  async addComment(taskId: string, content: string) {
    const res = await api.post(`/tasks/${taskId}/comments`, { content });
    return res.data.data.comment;
  },

  async deleteComment(commentId: string): Promise<void> {
    await api.delete(`/comments/${commentId}`);
  },
};
