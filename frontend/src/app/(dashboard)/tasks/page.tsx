'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/axios';
import { useAuthStore } from '../../../lib/store';
import { getPriorityColor, getStatusColor, formatDate } from '../../../lib/utils';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  KanbanSquare, 
  Calendar, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Sparkles, 
  ChevronRight,
  Clock,
  Tag,
  CheckSquare
} from 'lucide-react';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(5000).optional(),
  status: z.enum(['pending', 'in-progress', 'completed', 'archived']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  dueDate: z.string().optional().nullable(),
  category: z.string().max(50).optional(),
  notes: z.string().max(2000).optional(),
  labels: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export default function TasksPage() {
  const queryClient = useQueryClient();
  const { socket } = useAuthStore();
  const [view, setView] = useState<'board' | 'list' | 'grid'>('board');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modals state
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  // Subtask creation state
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Socket listener setup for real-time invalidation
  useEffect(() => {
    if (socket) {
      socket.on('task:created', () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      });
      socket.on('task:updated', () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      });
      socket.on('task:deleted', () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      });
      return () => {
        socket.off('task:created');
        socket.off('task:updated');
        socket.off('task:deleted');
      };
    }
  }, [socket, queryClient]);

  // Form hooks
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: 'pending',
      priority: 'medium',
      category: 'General',
    }
  });

  // Fetch Tasks Query
  const { data: response, isLoading } = useQuery({
    queryKey: ['tasks', search, statusFilter, priorityFilter, categoryFilter],
    queryFn: async () => {
      const params: Record<string, any> = { limit: 100 };
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;
      if (categoryFilter) params.category = categoryFilter;

      const res = await api.get('/tasks', { params });
      return res.data.data;
    },
  });

  const tasks = response || [];

  // Mutations
  const createTaskMutation = useMutation({
    mutationFn: async (values: any) => {
      const res = await api.post('/tasks', values);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Task created successfully');
      setCreateOpen(false);
      reset();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create task');
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: any }) => {
      const res = await api.put(`/tasks/${id}`, values);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Task updated successfully');
      setEditOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update task');
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Task deleted successfully');
    },
  });

  const patchStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await api.patch(`/tasks/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Task status updated');
    },
  });

  const addSubtaskMutation = useMutation({
    mutationFn: async ({ taskId, title }: { taskId: string; title: string }) => {
      await api.post(`/tasks/${taskId}/subtasks`, { title });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Subtask added');
      setNewSubtaskTitle('');
    }
  });

  const toggleSubtaskMutation = useMutation({
    mutationFn: async ({ taskId, subtaskId }: { taskId: string; subtaskId: string }) => {
      await api.patch(`/tasks/${taskId}/subtasks/${subtaskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const onCreateSubmit = (values: TaskFormValues) => {
    const formattedValues = {
      ...values,
      labels: values.labels ? values.labels.split(',').map(l => l.trim()) : [],
    };
    createTaskMutation.mutate(formattedValues);
  };

  const onEditSubmit = (values: TaskFormValues) => {
    const formattedValues = {
      ...values,
      labels: values.labels ? values.labels.split(',').map(l => l.trim()) : [],
    };
    updateTaskMutation.mutate({ id: selectedTask._id, values: formattedValues });
  };

  const openEditModal = (task: any) => {
    setSelectedTask(task);
    setValue('title', task.title);
    setValue('description', task.description || '');
    setValue('status', task.status);
    setValue('priority', task.priority);
    setValue('category', task.category || 'General');
    setValue('notes', task.notes || '');
    setValue('dueDate', task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    setValue('labels', task.labels ? task.labels.join(', ') : '');
    setEditOpen(true);
  };

  // Kanban Columns
  const columns = [
    { id: 'pending', title: 'Pending', color: 'border-amber-300' },
    { id: 'in-progress', title: 'In Progress', color: 'border-sky-300' },
    { id: 'completed', title: 'Completed', color: 'border-green-300' },
  ];

  return (
    <div className="space-y-6">
      {/* Header and Add Task */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#92400E]">Task Board</h2>
          <p className="text-sm text-[#78716C]">Manage and sort your workflow actions.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* View Toggle */}
          <div className="flex bg-[#FFF3B0] rounded-lg p-1 border border-[#D97706]/15">
            <button
              onClick={() => setView('board')}
              className={`p-1.5 rounded-md transition-all ${view === 'board' ? 'bg-[#D97706] text-white' : 'text-[#78716C]'}`}
            >
              <KanbanSquare className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('grid')}
              className={`p-1.5 rounded-md transition-all ${view === 'grid' ? 'bg-[#D97706] text-white' : 'text-[#78716C]'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-[#D97706] text-white' : 'text-[#78716C]'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Button onClick={() => { reset(); setCreateOpen(true); }} className="text-xs">
            <Plus className="w-4 h-4 mr-1" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="bg-white/80 border border-[#D97706]/12 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-warm-sm">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#A8A29E]" />
          <input
            type="text"
            placeholder="Filter by title..."
            className="pl-9 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs max-w-[140px]"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs max-w-[140px]"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          {/* Category filter input */}
          <input
            type="text"
            placeholder="Category..."
            className="text-xs max-w-[120px]"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Main Boards Panel */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-[450px] skeleton rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          {/* 1. Kanban Board View */}
          {view === 'board' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {columns.map((col) => {
                const colTasks = tasks.filter((t: any) => t.status === col.id);
                return (
                  <div key={col.id} className="bg-white/50 border border-[#D97706]/10 rounded-2xl p-4 min-h-[500px]">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#D97706]/10">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full border-2 ${col.color}`} />
                        <h3 className="font-extrabold text-[#92400E] text-sm">{col.title}</h3>
                      </div>
                      <Badge variant="secondary" className="px-2 py-0.5 text-[10px]">
                        {colTasks.length}
                      </Badge>
                    </div>

                    {/* Column Items */}
                    <div className="space-y-4">
                      {colTasks.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed border-[#D97706]/8 rounded-xl bg-white/20">
                          <p className="text-xs text-[#A8A29E] font-medium">No tasks</p>
                        </div>
                      ) : (
                        colTasks.map((task: any) => (
                          <div
                            key={task._id}
                            className="bg-white border border-[#D97706]/12 rounded-xl p-4 shadow-warm-sm hover:shadow-warm-md hover:-translate-y-0.5 transition-all duration-200"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[10px] text-[#A8A29E] font-bold tracking-wide uppercase">
                                {task.category || 'General'}
                              </span>
                              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                            </div>
                            <h4 className="font-extrabold text-sm text-[#1C1917] mb-1">{task.title}</h4>
                            <p className="text-xs text-[#78716C] line-clamp-2 mb-4 leading-relaxed">
                              {task.description || 'No description provided.'}
                            </p>

                            {/* Subtask mini tracker */}
                            {task.subtasks && task.subtasks.length > 0 && (
                              <div className="mb-4 space-y-1.5 pt-2 border-t border-[#D97706]/8">
                                <span className="text-[9px] font-bold text-[#A8A29E] uppercase block">Subtasks</span>
                                {task.subtasks.map((sub: any) => (
                                  <div key={sub._id} className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={sub.completed}
                                      onChange={() => toggleSubtaskMutation.mutate({ taskId: task._id, subtaskId: sub._id })}
                                      className="h-3 w-3 rounded text-[#D97706]"
                                    />
                                    <span className={`text-[11px] ${sub.completed ? 'line-through text-[#A8A29E]' : 'text-[#78716C] font-semibold'}`}>
                                      {sub.title}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Card Footer Actions */}
                            <div className="flex items-center justify-between pt-3 border-t border-[#D97706]/8 text-[10px] text-[#A8A29E]">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                <span className="font-semibold">{formatDate(task.dueDate)}</span>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => openEditModal(task)} className="p-1 hover:text-[#D97706] transition-colors">
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => deleteTaskMutation.mutate(task._id)} className="p-1 hover:text-red-500 transition-colors">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 2. Grid View */}
          {view === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.length === 0 ? (
                <div className="col-span-full text-center py-20 bg-white/60 rounded-xl border">
                  <p className="text-[#A8A29E] font-medium">No tasks found matching criteria.</p>
                </div>
              ) : (
                tasks.map((task: any) => (
                  <div
                    key={task._id}
                    className="bg-white border border-[#D97706]/12 rounded-xl p-4 shadow-warm-sm hover:shadow-warm-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] text-[#A8A29E] font-bold uppercase">{task.category || 'General'}</span>
                      <div className="flex gap-1.5">
                        <Badge variant="outline" className={getStatusColor(task.status)}>{task.status}</Badge>
                        <Badge variant="outline" className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      </div>
                    </div>
                    <h4 className="font-extrabold text-sm text-[#1C1917] mb-1">{task.title}</h4>
                    <p className="text-xs text-[#78716C] line-clamp-2 mb-4 leading-relaxed">
                      {task.description || 'No description.'}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-[#D97706]/8 text-[10px] text-[#A8A29E]">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="font-semibold">{formatDate(task.dueDate)}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openEditModal(task)} className="p-1 hover:text-[#D97706] transition-colors">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteTaskMutation.mutate(task._id)} className="p-1 hover:text-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 3. List View */}
          {view === 'list' && (
            <div className="bg-white border border-[#D97706]/12 rounded-xl shadow-warm-sm overflow-hidden divide-y divide-[#D97706]/10">
              {tasks.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-[#A8A29E] font-medium">No tasks found matching criteria.</p>
                </div>
              ) : (
                tasks.map((task: any) => (
                  <div key={task._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FFFBF0]/60 transition-colors">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        onChange={() => patchStatusMutation.mutate({
                          id: task._id,
                          status: task.status === 'completed' ? 'pending' : 'completed',
                        })}
                        className="h-4 w-4 rounded text-[#D97706]"
                      />
                      <div>
                        <h4 className={`font-extrabold text-sm text-[#1C1917] ${task.status === 'completed' ? 'line-through text-[#A8A29E]' : ''}`}>
                          {task.title}
                        </h4>
                        <span className="text-[10px] text-[#A8A29E] font-bold uppercase">{task.category || 'General'}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 justify-end text-[11px]">
                      <div className="flex items-center gap-1 text-[#A8A29E]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatDate(task.dueDate)}</span>
                      </div>
                      <Badge variant="outline" className={getStatusColor(task.status)}>{task.status}</Badge>
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      <div className="flex gap-2 ml-4">
                        <button onClick={() => openEditModal(task)} className="p-1 hover:text-[#D97706] text-[#A8A29E]">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteTaskMutation.mutate(task._id)} className="p-1 hover:text-red-500 text-[#A8A29E]">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* CREATE TASK DIALOG */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>Add a new tracking task to your productivity list.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onCreateSubmit)} className="space-y-4 pt-4">
            <Input label="Task Title" placeholder="Draft marketing plan" error={errors.title?.message} {...register('title')} />
            
            <div>
              <label className="text-xs font-bold text-[#92400E] mb-1.5 block">Description</label>
              <textarea placeholder="Describe this action..." {...register('description')} className="min-h-[80px]" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#92400E] mb-1.5 block">Status</label>
                <select {...register('status')}>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#92400E] mb-1.5 block">Priority</label>
                <select {...register('priority')}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Category" placeholder="Productivity" error={errors.category?.message} {...register('category')} />
              <div>
                <label className="text-xs font-bold text-[#92400E] mb-1.5 block">Due Date</label>
                <input type="date" {...register('dueDate')} />
              </div>
            </div>

            <Input label="Labels (comma separated)" placeholder="v1, priority-list" error={errors.labels?.message} {...register('labels')} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createTaskMutation.isPending}>Add Action</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT TASK DIALOG */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Modify actions or append subtasks directly.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4 pt-4">
            <Input label="Task Title" placeholder="Draft marketing plan" error={errors.title?.message} {...register('title')} />
            
            <div>
              <label className="text-xs font-bold text-[#92400E] mb-1.5 block">Description</label>
              <textarea placeholder="Describe this action..." {...register('description')} className="min-h-[80px]" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#92400E] mb-1.5 block">Status</label>
                <select {...register('status')}>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#92400E] mb-1.5 block">Priority</label>
                <select {...register('priority')}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Category" placeholder="Productivity" error={errors.category?.message} {...register('category')} />
              <div>
                <label className="text-xs font-bold text-[#92400E] mb-1.5 block">Due Date</label>
                <input type="date" {...register('dueDate')} />
              </div>
            </div>

            <Input label="Labels (comma separated)" placeholder="v1, priority-list" error={errors.labels?.message} {...register('labels')} />

            {/* Subtask creation within Edit Modal */}
            <div className="border-t border-[#D97706]/10 pt-4 mt-4 space-y-2">
              <label className="text-xs font-bold text-[#92400E] block">Manage Subtasks</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="New subtask..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  className="text-xs h-8 flex-1"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    if (newSubtaskTitle.trim()) {
                      addSubtaskMutation.mutate({ taskId: selectedTask._id, title: newSubtaskTitle });
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={updateTaskMutation.isPending}>Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

