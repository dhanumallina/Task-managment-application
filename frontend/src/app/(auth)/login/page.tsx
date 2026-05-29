'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuthStore } from '../../../lib/store';
import { api } from '../../../lib/axios';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Sparkles, Loader2, Key } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setToken, connectSocket } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitting(true);
    try {
      const res = await api.post('/auth/login', values);
      const { accessToken, user } = res.data.data;
      
      setToken(accessToken);
      setUser(user);
      connectSocket(accessToken);
      
      toast.success('Welcome back to Lumio!');
      router.push('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-40 z-0" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#D97706] text-white shadow-warm-md mb-4">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold text-[#92400E] tracking-tight">Welcome back</h2>
        <p className="mt-2 text-sm text-[#78716C]">
          Or{' '}
          <Link href="/register" className="font-semibold text-[#D97706] hover:text-[#B45309] transition-colors">
            create a free account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white/80 backdrop-blur-md py-8 px-6 border border-[#D97706]/12 shadow-warm-lg rounded-2xl">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-semibold text-[#92400E]">Password</label>
                <Link href="/forgot-password" className="text-xs font-semibold text-[#D97706] hover:underline">
                  Forgot?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </div>

        {/* Demo credentials hint */}
        <div className="mt-4 mx-auto max-w-md px-4">
          <div className="bg-[#FEF3C7]/80 border border-[#D97706]/20 rounded-xl p-3 text-center">
            <p className="text-xs font-bold text-[#92400E] mb-0.5">🔑 Demo Account</p>
            <p className="text-[11px] text-[#78716C]">Email: <span className="font-bold text-[#D97706]">demo@lumio.app</span> · Password: <span className="font-bold text-[#D97706]">Password123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

