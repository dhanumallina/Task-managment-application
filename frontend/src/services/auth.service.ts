import api from './api';
import type { User } from '@/types/user';

export interface LoginPayload { email: string; password: string }
export interface RegisterPayload { name: string; email: string; password: string }
export interface AuthResponse { accessToken: string; user: User }

export const authService = {
  async register(data: RegisterPayload): Promise<AuthResponse> {
    const res = await api.post('/auth/register', data);
    return res.data.data;
  },

  async login(data: LoginPayload): Promise<AuthResponse> {
    const res = await api.post('/auth/login', data);
    return res.data.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async refresh(): Promise<{ accessToken: string }> {
    const res = await api.post('/auth/refresh');
    return res.data.data;
  },

  async getMe(): Promise<User> {
    const res = await api.get('/auth/me');
    return res.data.data.user;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const res = await api.put('/users/profile', data);
    return res.data.data.user;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.put('/users/password', { currentPassword, newPassword });
  },
};
