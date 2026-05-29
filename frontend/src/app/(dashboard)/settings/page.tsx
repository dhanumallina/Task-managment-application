'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { api } from '../../../lib/axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { KeyRound, ShieldCheck, Eye, EyeOff, Loader2 } from 'lucide-react';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (values: PasswordFormValues) => {
    setSubmitting(true);
    try {
      await api.put('/users/change-password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success('Password updated successfully');
      reset();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password. Make sure current is correct.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-[#92400E]">Settings</h2>
        <p className="text-sm text-[#78716C]">Adjust details regarding safety and preferences.</p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-[#92400E]">
              <KeyRound className="w-5 h-5" />
              <CardTitle className="text-base font-bold">Update Security Credentials</CardTitle>
            </div>
            <CardDescription>Adjust credentials used to secure your workspace.</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 pt-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••"
                error={errors.currentPassword?.message}
                {...register('currentPassword')}
              />

              <Input
                label="New Password"
                type="password"
                placeholder="At least 6 characters"
                error={errors.newPassword?.message}
                {...register('newPassword')}
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Repeat new password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
            </CardContent>

            <CardFooter className="flex justify-end gap-3 bg-[#FFFBF0]/60 p-4 border-t border-[#D97706]/10 rounded-b-xl">
              <Button type="button" variant="outline" onClick={() => reset()} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="text-xs">
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Change Password'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

