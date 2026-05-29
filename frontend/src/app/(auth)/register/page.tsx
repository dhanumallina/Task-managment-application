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
import { Sparkles, Loader2 } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
    .regex(/(?=.*[a-zA-Z])(?=.*[0-9])/, 'Password must contain at least one letter and one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, setToken, connectSocket } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setSubmitting(true);
    try {
      const res = await api.post('/auth/register', {
        name: values.name,
        email: values.email,
        password: values.password,
      });
      const { accessToken, user } = res.data.data;
      
      setToken(accessToken);
      setUser(user);
      connectSocket(accessToken);
      
      toast.success('Welcome to Lumio! Your workspace has been initialized.');
      router.push('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Email might already be registered.';
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
        <h2 className="text-3xl font-extrabold text-[#92400E] tracking-tight">Create your account</h2>
        <p className="mt-2 text-sm text-[#78716C]">
          Or{' '}
          <Link href="/login" className="font-semibold text-[#D97706] hover:text-[#B45309] transition-colors">
            log into your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white/80 backdrop-blur-md py-8 px-6 border border-[#D97706]/12 shadow-warm-lg rounded-2xl">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Full Name"
              type="text"
              placeholder="Alex Rivera"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="alex@workspace.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating workspace...
                </>
              ) : (
                'Initialize Workspace'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

