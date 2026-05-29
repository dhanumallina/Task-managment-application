'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/axios';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Bell, Check, Trash2, CheckSquare } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '../../../lib/utils';

export default function NotificationsPage() {
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['notifications', 'list'],
    queryFn: async () => {
      const res = await api.get('/notifications');
      return res.data.data;
    },
  });

  const notifications = notificationsData || [];

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification marked as read');
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      await api.patch('/notifications/mark-all-read');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read');
    },
  });

  const deleteNotifMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/notifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification deleted');
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#92400E]">Notification Hub</h2>
          <p className="text-sm text-[#78716C]">Review team updates and due dates alerts.</p>
        </div>

        {notifications.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => markAllReadMutation.mutate()} className="text-xs">
            <Check className="w-4 h-4 mr-1.5" />
            Mark all read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl skeleton" />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0 divide-y divide-[#D97706]/10">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                <div className="p-3 bg-[#FEF3C7] rounded-full border border-[#D97706]/20 text-[#D97706]">
                  <Bell className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#92400E]">Workspace is quiet</h3>
                  <p className="text-xs text-[#A8A29E] mt-1">We will notify you when things require action.</p>
                </div>
              </div>
            ) : (
              notifications.map((notif: any) => (
                <div
                  key={notif._id}
                  className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                    !notif.read ? 'bg-[#FFFBF0]/60' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${!notif.read ? 'bg-[#D97706]' : 'bg-transparent'}`} />
                    <div>
                      <p className="text-sm font-semibold text-[#1C1917]">{notif.message}</p>
                      <span className="text-[10px] text-[#A8A29E] font-bold block mt-0.5">
                        {formatDate(notif.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!notif.read && (
                      <button
                        onClick={() => markReadMutation.mutate(notif._id)}
                        className="p-1.5 hover:bg-[#FEF3C7] rounded-md text-[#A8A29E] hover:text-[#92400E] transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotifMutation.mutate(notif._id)}
                      className="p-1.5 hover:bg-red-50 rounded-md text-[#A8A29E] hover:text-red-600 transition-colors"
                      title="Delete notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

