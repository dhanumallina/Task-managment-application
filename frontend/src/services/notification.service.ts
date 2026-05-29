import api from './api';

export const notificationService = {
  async getNotifications() {
    const res = await api.get('/notifications');
    return res.data.data.notifications;
  },

  async markAsRead(id: string) {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data.data.notification;
  },

  async markAllAsRead() {
    await api.patch('/notifications/read-all');
  },

  async getUnreadCount(): Promise<number> {
    const res = await api.get('/notifications/unread-count');
    return res.data.data.count;
  },
};
