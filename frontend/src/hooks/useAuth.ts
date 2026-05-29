'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import type { LoginPayload, RegisterPayload } from '@/services/auth.service';

export function useMe() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['me'],
    queryFn: authService.getMe,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: LoginPayload) => authService.login(data),
    onSuccess: ({ user, accessToken }) => {
      setAuth(user, accessToken);
      qc.setQueryData(['me'], user);
      toast.success(`Welcome back, ${user.name}!`);
      router.push('/dashboard');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Login failed');
    },
  });
}

export function useRegister() {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  return useMutation({
    mutationFn: (data: RegisterPayload) => authService.register(data),
    onSuccess: ({ user, accessToken }) => {
      setAuth(user, accessToken);
      toast.success('Account created! Welcome aboard 🎉');
      router.push('/dashboard');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Registration failed');
    },
  });
}

export function useLogout() {
  const { clearAuth } = useAuthStore();
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      clearAuth();
      qc.clear();
      router.push('/login');
    },
  });
}
