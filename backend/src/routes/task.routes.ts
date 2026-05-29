import { Router } from 'express';
import {
  getTasks, getTask, createTask, updateTask, deleteTask,
  updateTaskStatus, getTaskStats, createSubtask, updateSubtask,
} from '../controllers/task.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

router.get   ('/',                           getTasks);
router.get   ('/stats',                      getTaskStats);
router.post  ('/',                           createTask);
router.get   ('/:id',                        getTask);
router.put   ('/:id',                        updateTask);
router.delete('/:id',                        deleteTask);
router.patch ('/:id/status',                 updateTaskStatus);
router.post  ('/:id/subtasks',               createSubtask);
router.patch ('/:id/subtasks/:subtaskId',    updateSubtask);

export default router;
