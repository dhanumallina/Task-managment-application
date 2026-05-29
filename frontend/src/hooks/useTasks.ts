import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/services/task.service';
import { useUIStore } from '@/store/uiStore';
import { toast } from 'sonner';
import type { TaskFilters, CreateTaskPayload, UpdateTaskPayload } from '@/types/task';

export function useTasks(filters?: TaskFilters) {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => taskService.getTasks(filters),
    staleTime: 30 * 1000,
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => taskService.getTask(id),
    enabled: !!id,
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  const { closeTaskModal } = useUIStore();
  return useMutation({
    mutationFn: (data: CreateTaskPayload) => taskService.createTask(data),
    onSuccess: (task) => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      closeTaskModal();
      toast.success(`Task "${task.title}" created!`);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to create task');
    },
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskPayload }) =>
      taskService.updateTask(id, data),
    onSuccess: (task) => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      qc.setQueryData(['task', task.id], task);
      toast.success('Task updated');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update task');
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  const { closeTaskModal } = useUIStore();
  return useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      closeTaskModal();
      toast.success('Task deleted');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to delete task');
    },
  });
}

export function useUpdateTaskStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: any }) =>
      taskService.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

import React from 'react';
