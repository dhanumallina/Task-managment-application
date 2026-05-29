'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Sparkles, ArrowLeft, Send } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (values: FormValues) => {
    setLoading(true);
    // Mock sending recovery link
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast.success(`Reset link sent to ${values.email}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-40 z-0" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#D97706] text-white shadow-warm-md mb-4">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold text-[#92400E] tracking-tight">Recover Password</h2>
        <p className="mt-2 text-sm text-[#78716C]">
          We will send you instructions to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white/80 backdrop-blur-md py-8 px-6 border border-[#D97706]/12 shadow-warm-lg rounded-2xl">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#DCFCE7] text-green-700 mx-auto flex items-center justify-center border border-green-200">
                <Send className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#92400E]">Instructions Sent</h3>
              <p className="text-sm text-[#78716C] leading-relaxed">
                Check your inbox for a link to reset your password. If you don&apos;t receive it, verify your spam folder.
              </p>
              <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-[#D97706] hover:underline mt-4">
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending link...' : 'Send Recovery Link'}
              </Button>

              <div className="text-center mt-4">
                <Link href="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-[#78716C] hover:text-[#92400E] transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

