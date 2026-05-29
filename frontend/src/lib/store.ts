import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { User, UpdateProfilePayload } from '../types/user';
import { api } from './axios';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  socket: Socket | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  initializeAuth: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfileState: (payload: UpdateProfilePayload) => void;
  connectSocket: (token: string) => void;
  disconnectSocket: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
  socket: null,

  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
    }
    set({ accessToken: token });
  },

  initializeAuth: async () => {
    set({ isLoading: true });
    const token = localStorage.getItem('accessToken');
    if (!token) {
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      set({ accessToken: token });
      const res = await api.get('/auth/me');
      const { user } = res.data.data;
      set({ user, isAuthenticated: true });
      get().connectSocket(token);
    } catch (err) {
      localStorage.removeItem('accessToken');
      set({ user: null, accessToken: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      get().disconnectSocket();
      localStorage.removeItem('accessToken');
      set({ user: null, accessToken: null, isAuthenticated: false });
    }
  },

  updateProfileState: (payload) => {
    const currentUser = get().user;
    if (currentUser) {
      set({
        user: {
          ...currentUser,
          name: payload.name ?? currentUser.name,
          avatar: payload.avatar ?? currentUser.avatar,
          preferences: {
            ...currentUser.preferences,
            ...(payload.preferences ?? {}),
          },
        },
      });
    }
  },

  connectSocket: (token: string) => {
    const currentSocket = get().socket;
    if (currentSocket) {
      currentSocket.disconnect();
    }

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl, {
      auth: { token },
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Socket connected successfully');
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const currentSocket = get().socket;
    if (currentSocket) {
      currentSocket.disconnect();
      set({ socket: null });
    }
  },
}));

// Listen for global logout event dispatched by Axios interceptor on 401 refresh failure
if (typeof window !== 'undefined') {
  window.addEventListener('auth:logout', () => {
    useAuthStore.getState().disconnectSocket();
    useAuthStore.setState({ user: null, accessToken: null, isAuthenticated: false });
  });
}

