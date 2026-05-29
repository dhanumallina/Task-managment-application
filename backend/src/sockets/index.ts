import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from '../utils/tokens.js';

export function setupSocket(io: Server) {
  const activeSockets = new Map<string, string[]>(); // userId -> socketIds

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }
    try {
      const payload = verifyAccessToken(token);
      (socket as any).userId = payload.userId;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = (socket as any).userId;
    if (userId) {
      const existing = activeSockets.get(userId) || [];
      activeSockets.set(userId, [...existing, socket.id]);
      socket.join(`user:${userId}`);
      console.log(`Socket user connected: ${userId} (Socket: ${socket.id})`);
    }

    socket.on('disconnect', () => {
      if (userId) {
        const existing = activeSockets.get(userId) || [];
        const filtered = existing.filter(id => id !== socket.id);
        if (filtered.length > 0) {
          activeSockets.set(userId, filtered);
        } else {
          activeSockets.delete(userId);
        }
        console.log(`Socket user disconnected: ${userId} (Socket: ${socket.id})`);
      }
    });
  });

  // Return emitter utilities
  return {
    emitTaskCreated: (userId: string, task: any) => {
      io.to(`user:${userId}`).emit('task:created', task);
    },
    emitTaskUpdated: (userId: string, task: any) => {
      io.to(`user:${userId}`).emit('task:updated', task);
    },
    emitTaskDeleted: (userId: string, taskId: string) => {
      io.to(`user:${userId}`).emit('task:deleted', { taskId });
    },
    emitNotification: (userId: string, notification: any) => {
      io.to(`user:${userId}`).emit('notification:new', notification);
    }
  };
}
